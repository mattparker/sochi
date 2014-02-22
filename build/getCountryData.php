<?php

/**
 * Gets the HDI data from csv
 */


$file = fopen('../rawdata/countrynames.csv', 'r');


$existingDataStr = file_get_contents('data.php');
if ($existingDataStr) {
    $existingData = unserialize($existingDataStr);
} else {
    $existingData = array();
}



while (false !== ($csv = fgetcsv($file))) {

    if (!array_key_exists($csv[2], $existingData)) {
        $existingData[$csv[2]] = array();
    }
    $existingData[$csv[2]]['image_name'] = strtolower($csv[1]);

}
print_r($existingData);


file_put_contents('data.php', serialize($existingData));
fclose($file);
