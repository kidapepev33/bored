<?php
header('Content-Type: application/json; charset=utf-8');
error_reporting(0);

require_once '../../config/server.php';

if (!isset($_GET['q'])) {
    echo json_encode([
        'success' => false,
        'mensaje' => 'No se proporcionó término de búsqueda'
    ]);
    exit;
}

$query = trim($_GET['q']);

// Función para calcular similitud entre dos strings (Levenshtein mejorado)
function calcularSimilitud($str1, $str2) {
    $str1 = strtolower($str1);
    $str2 = strtolower($str2);
    
    // Si son iguales, 100% de similitud
    if ($str1 === $str2) {
        return 100;
    }
    
    // Calcular similar_text
    similar_text($str1, $str2, $percent);
    
    // También calcular con Levenshtein (distancia de edición)
    $lev = levenshtein($str1, $str2);
    $maxLen = max(strlen($str1), strlen($str2));
    $levPercent = $maxLen > 0 ? ((1 - $lev / $maxLen) * 100) : 0;
    
    // Promedio de ambos métodos
    return ($percent + $levPercent) / 2;
}

// Función para normalizar texto (quitar acentos, etc.)
function normalizar($texto) {
    $texto = strtolower($texto);
    $acentos = ['á'=>'a', 'é'=>'e', 'í'=>'i', 'ó'=>'o', 'ú'=>'u', 'ñ'=>'n'];
    return strtr($texto, $acentos);
}

try {
    // PASO 1: Búsqueda exacta con LIKE
    $stmt = $conn->prepare("
        SELECT *, 100 as similitud FROM products 
        WHERE name LIKE ? 
        OR plataform LIKE ? 
        OR category LIKE ?
        LIMIT 20
    ");
    
    $likeQuery = "%{$query}%";
    $stmt->bind_param("sss", $likeQuery, $likeQuery, $likeQuery);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $productos = [];
    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
    
    // PASO 2: Si no hay resultados exactos, búsqueda fuzzy
    if (empty($productos)) {
        $stmt = $conn->prepare("SELECT * FROM products");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $candidatos = [];
        $queryNormalizado = normalizar($query);
        
        while ($row = $result->fetch_assoc()) {
            // Calcular similitud con nombre
            $nombreNormalizado = normalizar($row['name']);
            $similitudNombre = calcularSimilitud($queryNormalizado, $nombreNormalizado);
            
            // Calcular similitud con plataforma
            $plataformaNormalizada = normalizar($row['plataform']);
            $similitudPlataforma = calcularSimilitud($queryNormalizado, $plataformaNormalizada);
            
            // También buscar por palabras individuales
            $palabrasQuery = explode(' ', $queryNormalizado);
            $palabrasNombre = explode(' ', $nombreNormalizado);
            
            $similitudPalabras = 0;
            foreach ($palabrasQuery as $palabraQuery) {
                foreach ($palabrasNombre as $palabraNombre) {
                    $simPalabra = calcularSimilitud($palabraQuery, $palabraNombre);
                    if ($simPalabra > $similitudPalabras) {
                        $similitudPalabras = $simPalabra;
                    }
                }
            }
            
            // Tomar la mayor similitud
            $similitudMaxima = max($similitudNombre, $similitudPlataforma, $similitudPalabras);
            
            // Umbral de similitud: 60% (ajustable)
            if ($similitudMaxima >= 60) {
                $row['similitud'] = round($similitudMaxima, 2);
                $candidatos[] = $row;
            }
        }
        
        // Ordenar por similitud (mayor primero)
        usort($candidatos, function($a, $b) {
            return $b['similitud'] <=> $a['similitud'];
        });
        
        $productos = array_slice($candidatos, 0, 20);
    }
    
    // Si aún no hay resultados, buscar con umbral más bajo (50%)
    if (empty($productos)) {
        $stmt = $conn->prepare("SELECT * FROM products");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $candidatos = [];
        $queryNormalizado = normalizar($query);
        
        while ($row = $result->fetch_assoc()) {
            $nombreNormalizado = normalizar($row['name']);
            $similitud = calcularSimilitud($queryNormalizado, $nombreNormalizado);
            
            if ($similitud >= 50) {
                $row['similitud'] = round($similitud, 2);
                $candidatos[] = $row;
            }
        }
        
        usort($candidatos, function($a, $b) {
            return $b['similitud'] <=> $a['similitud'];
        });
        
        $productos = array_slice($candidatos, 0, 10);
    }
    
    echo json_encode([
        'success' => true,
        'productos' => $productos,
        'query' => $query,
        'total' => count($productos)
    ]);
    exit;
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'mensaje' => 'Error en la búsqueda',
        'error' => $e->getMessage()
    ]);
    exit;
}
?>