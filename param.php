<?php

//error_reporting(E_ERROR | E_WARNING | E_PARSE);

setlocale(LC_ALL, 'ru_RU.UTF-8');

$db = new mysqli('localhost','sms','Fs0TR2bMCG4x3gLc','sms');
if($db->connect_errno){
    echo $db->connect_error;
}
$db->set_charset("utf8");
