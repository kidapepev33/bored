<?php
ob_start();
require_once '../../config/server.php';
session_start();
ob_end_clean();

header('Content-Type: application/json; charset=utf-8');

$html = '<div class="user-details-section upload-game-section">
    <form id="upload-product-form" enctype="multipart/form-data">
        <div id="upload-product-message" class="register_tittle hidden"></div>
        
        <div class="form-group">
            <label for="product-name">Nombre del Producto:</label>
            <input type="text" name="name" id="product-name" placeholder="Ej: Elden Ring" required>
        </div>
        
        <div class="form-group">
            <label for="product-description">Descripción:</label>
            <textarea name="description" id="product-description" placeholder="Describe el producto..." rows="4" required></textarea>
        </div>
        
        <div class="form-group">
            <label for="product-category">Categoría:</label>
            <select name="category" id="product-category" class="form-select" required>
                <option class="disabled_option" value="" disabled selected>Seleccione la categoría</option>
                <option value="RPG">RPG</option>
                <option value="Sandbox">Sandbox</option>
                <option value="Metroidvania">Metroidvania</option>
                <option value="Accion">Acción</option>
                <option value="Aventura">Aventura</option>
                <option value="Deportes">Deportes</option>
                <option value="Estrategia">Estrategia</option>
                <option value="Terror">Terror</option>
                <option value="Carreras">Carreras</option>
                <option value="Simulacion">Simulación</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="product-plataform">Plataforma:</label>
            <select name="plataform" id="product-plataform" class="form-select" required>
                <option class="disabled_option" value="" disabled selected>Seleccione la plataforma</option>
                <option value="Pc">PC</option>
                <option value="Nintendo">Nintendo</option>
                <option value="PlayStation">PlayStation</option>
                <option value="Xbox">Xbox</option>
                <option value="Multi">Multiplataforma</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="product-stock">Stock:</label>
            <input type="number" name="stock" id="product-stock" placeholder="100" min="0" required>
        </div>
        
        <div class="form-group">
            <label for="product-price">Precio:</label>
            <input type="number" name="precio" id="product-price" placeholder="5000" min="0" required>
        </div>
        
        <div class="form-group">
            <label for="product-image">Imagen del Producto:</label>
            <input type="file" name="img" id="product-image" accept="image/*" required>
        </div>
        
        <div class="form-group preview-container" id="preview-container" style="display:none;">
            <label>Vista previa:</label>
            <img id="image-preview" src="" alt="Preview" style="max-width: 300px; border-radius: 8px;">
        </div>
        
        <button type="submit" class="btn button">Agregar Producto</button>
    </form>
</div>';

echo json_encode(['success' => true, 'html' => $html]);
?>