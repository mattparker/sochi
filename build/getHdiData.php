<?php

/**
 * Gets the HDI data from csv
 */


$file = fopen('../rawdata/HDI.csv', 'r');


$existingDataStr = file_get_contents('data.php');
if ($existingDataStr) {
    $existingData = unserialize($existingDataStr);
} else {
    $existingData = array();
}



while (false !== ($csv = fgetcsv($file))) {

    if (!array_key_exists($csv[3], $existingData)) {
        $existingData[$csv[3]] = array();
    }
    $existingData[$csv[3]]['hdi_rank'] = $csv[0];
    $existingData[$csv[3]]['hdi_score'] = $csv[4];
    $existingData[$csv[3]]['country_name'] = $csv[1];

}
print_r($existingData);


file_put_contents('data.php', serialize($existingData));
fclose($file);
