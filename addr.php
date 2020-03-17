<?php
require('param.php');

if(isset($_GET["addr"])) {
    $addr = trim($_GET["addr"]);
    if ($stmt = $db->prepare("SELECT `lat`, `long` FROM `coords` WHERE `addr` = ?")) {
        $stmt->bind_param("s", $addr);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_array(MYSQLI_ASSOC);
        if($row !== NULL) {
            echo json_encode(['lat' => $row['lat'], 'long' => $row['long'], 'error' => 'OK']);
        }
        else {
            if(isset($_GET["lat"]) && isset($_GET["long"])) {
                $lat = trim($_GET["lat"]);
                $long = trim($_GET["long"]);
                if ($stmt = $db->prepare("INSERT INTO `coords`(`addr`, `lat`, `long`) VALUES (?, ?, ?)")) {
                    $stmt->bind_param("sdd", $addr, $lat, $long);
                    $stmt->execute();
                    $id = $db->insert_id;
                    echo json_encode(['lat' => $lat, 'long' => $long, 'error' => 'ID: ' . $id]);
                }
            }
            else {
                echo json_encode(['lat' => 0, 'long' => 0, 'error' => 'NULL']);
            }
        }
    }
    else {
        echo json_encode(['lat' => 0, 'long' => 0, 'error' => 'Mysql']);
    }
}
else {
    echo json_encode(['lat' => 0, 'long' => 0, 'error' => 'Wrong']);
}
