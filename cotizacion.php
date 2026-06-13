<?php
header('Content-Type: application/json; charset=utf-8');

// Configuración del correo receptor
$recipient_email = 'atencionaclientes@prolabqro.com';
$subject = 'Nueva Solicitud de Cotización - Pro-Lab Queretaro';

// Inicializar respuesta
$response = [
    'status' => 'error',
    'message' => 'Ocurrió un error inesperado al procesar su solicitud.'
];

// Comprobar que la petición es POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitizar y validar los campos recibidos
    $name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
    $email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL) : false;
    $phone = isset($_POST['phone']) ? strip_tags(trim($_POST['phone'])) : '';
    $message_content = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';

    // Validar requeridos
    if (empty($name)) {
        $response['message'] = 'Por favor, proporcione su nombre completo.';
        echo json_encode($response);
        exit;
    }
    if (!$email) {
        $response['message'] = 'Por favor, proporcione un correo electrónico válido.';
        echo json_encode($response);
        exit;
    }
    if (empty($phone)) {
        $response['message'] = 'Por favor, proporcione un número de teléfono.';
        echo json_encode($response);
        exit;
    }
    if (empty($message_content)) {
        $response['message'] = 'Por favor, describa su requerimiento.';
        echo json_encode($response);
        exit;
    }

    // Cuerpo del correo en HTML limpio y profesional
    $email_body = '
    <html>
    <head>
        <title>' . htmlspecialchars($subject) . '</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 20px; background-color: #f4f6f9; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .header { border-bottom: 2px solid #2CB0DC; padding-bottom: 15px; margin-bottom: 25px; }
            .header h2 { color: #0f172a; margin: 0; font-size: 24px; text-transform: uppercase; font-weight: 800; }
            .header p { color: #64748b; margin: 5px 0 0 0; font-size: 14px; }
            .field-group { margin-bottom: 18px; }
            .field-title { font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; margin-bottom: 4px; display: block; }
            .field-value { background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; font-size: 15px; color: #1e293b; white-space: pre-wrap; }
            .footer { border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Pro-Lab Queretaro</h2>
                <p>Nueva Solicitud de Cotización desde el Sitio Web</p>
            </div>
            
            <div class="field-group">
                <span class="field-title">Cliente / Remitente</span>
                <div class="field-value">' . htmlspecialchars($name) . '</div>
            </div>
            
            <div class="field-group">
                <span class="field-title">Correo Electrónico</span>
                <div class="field-value"><a href="mailto:' . htmlspecialchars($email) . '" style="color: #2CB0DC; text-decoration: none;">' . htmlspecialchars($email) . '</a></div>
            </div>
            
            <div class="field-group">
                <span class="field-title">Teléfono</span>
                <div class="field-value"><a href="tel:' . htmlspecialchars($phone) . '" style="color: #2CB0DC; text-decoration: none;">' . htmlspecialchars($phone) . '</a></div>
            </div>
            
            <div class="field-group">
                <span class="field-title">Descripción del Requerimiento / Insumos</span>
                <div class="field-value">' . nl2br(htmlspecialchars($message_content)) . '</div>
            </div>
            
            <div class="footer">
                Este mensaje fue generado automáticamente por el formulario de cotización de Pro-Lab Queretaro.
            </div>
        </div>
    </body>
    </html>
    ';

    // Cabeceras del correo para envío HTML compatible
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    
    // De quién viene el correo (nombre amigable, usando dominio del sitio para evitar bloqueos por SPF)
    $headers .= "From: Cotizaciones Pro-Lab <no-reply@prolabqro.com>\r\n";
    // Hacia quién va la respuesta directa
    $headers .= "Reply-To: " . $name . " <" . $email . ">\r\n";

    // Enviar el correo
    $mail_sent = @mail($recipient_email, $subject, $email_body, $headers);

    if ($mail_sent) {
        $response['status'] = 'success';
        $response['message'] = '¡Su solicitud de cotización ha sido enviada con éxito! Nos pondremos en contacto pronto.';
    } else {
        // Fallback local: Si falla el envío (común en XAMPP local), guardamos el correo en un archivo HTML
        $log_file = __DIR__ . '/cotizaciones_locales.html';
        $log_entry = "<!-- FECHA DE ENVÍO: " . date('Y-m-d H:i:s') . " -->\n" . $email_body . "\n<hr style='border: 2px dashed #2CB0DC; margin: 40px 0;'>\n";
        
        if (@file_put_contents($log_file, $log_entry, FILE_APPEND) !== false) {
            $response['status'] = 'success';
            $response['message'] = '¡Simulación local exitosa! Como estás en XAMPP local sin servidor de correo activo, guardamos la cotización en el archivo "cotizaciones_locales.html" en la raíz del proyecto para que puedas revisar el diseño del correo.';
        } else {
            $response['message'] = 'No se pudo enviar el correo ni guardar la simulación local. Verifique los permisos de escritura.';
        }
    }
} else {
    $response['message'] = 'Método de petición no permitido.';
}

echo json_encode($response);
exit;
?>
