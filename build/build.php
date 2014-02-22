<?php


$dataStr = file_get_contents('data.php');
$data = unserialize($dataStr);
file_put_contents('../site/js/sochi-data.js', 'var SOCHIDATA = ' . json_encode($data));