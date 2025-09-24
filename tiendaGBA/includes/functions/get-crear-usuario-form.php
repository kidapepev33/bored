<?php
ob_start();
require_once '../../config/server.php';
session_start();
ob_end_clean();

header('Content-Type: application/json; charset=utf-8');

$html = '<div class="user-details-section create-admin-user">
    <p class="create-admin-user">Crea una cuenta con permisos de administrador</p>
    <form id="create-user">
        <div id="create-user-message" class="register_tittle hidden"></div>
        <div class="form-group-inline">
            <div class="form-group">
                <label for="create-user-name">Nombre:</label>
                <input type="text" name="name" id="create-user-name" placeholder="Nombre" required>
            </div>
            <div class="form-group">
                <label for="create-user-lastname">Apellidos:</label>
                <input type="text" name="lastname" id="create-user-lastname" placeholder="Apellidos" required>
            </div>
        </div>
        <div class="form-group">
            <label for="create-user-email">Email:</label>
            <input type="email" name="email" id="create-user-email" placeholder="Email" required>
        </div>
        <div class="form-group">
            <label for="create-user-phone">Telefono:</label>
            <input type="tel" name="phone" id="create-user-phone" placeholder="Telefono" required>
        </div>
        <div class="form-group">
            <label for="create-user-gender">Genero:</label>
            <select name="gender" id="create-user-gender" class="form-select" required>
                <option value="" disabled selected>Seleccione su genero</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
                <option value="no-especificado">Prefiero no especificar</option>
            </select>
        </div>
        <div class="form-group">
            <label for="create-user-password">Contraseña:</label>
            <input type="password" name="password" id="create-user-password" placeholder="Contraseña" required>
        </div>
        <div class="form-group">
            <label for="create-user-confirm-password">Confirmar Contraseña:</label>
            <input type="password" name="confirm-password" id="create-user-confirm-password" placeholder="Confirmar contraseña" required>
        </div>
        <div class="form-group">
            <label>Rol:</label>
            <input type="radio" id="rol-client" name="rol" value="client">
            <label for="rol-client">Client</label><br>
            <input type="radio" id="rol-admin" name="rol" value="admin">
            <label for="rol-admin">Admin</label><br>
        </div>
        <button type="submit" class="btn btn-primary">Crear Usuario</button>
    </form>
</div>';

echo json_encode(['success' => true, 'html' => $html]);
?>