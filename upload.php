<?php
if (isset($_FILES['uploadFile'])) {
    $content = file_get_contents($_FILES['uploadFile']['tmp_name']);
    
    // test if proper JSON
    if (!is_null(json_decode($content))) {
        http_response_code(200);
        header('Content-type: application/json');
        echo $content;
    } else {
        // Unsupported Media Type
        http_response_code(415); 
    }
    
    exit;
}
// Bad Request
http_response_code(400);
