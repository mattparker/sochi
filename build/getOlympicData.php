<?php
/**
 * User: matt
 * Date: 21/02/14
 * Time: 18:46
 */


$olyDataStr = file_get_contents('../rawdata/olympicdata.json');
$data = json_decode($olyDataStr);


// defines $existingData array

$existingDataStr = file_get_contents('data.php');
if ($existingDataStr) {
    $existingData = unserialize($existingDataStr);
} else {
    $existingData = array();
}


$sortedData = [];

foreach ($data->data as $d) {

    $sortedData[] = array(
        'abbr' => $d->abbr,
        'gold' => $d->medals->gold,
        'silver' => $d->medals->silver,
        'bronze' => $d->medals->bronze,
        'total' => $d->medals->total
    );

}

uasort($sortedData, function ($b, $a) {
    if ($a['gold'] < $b ['gold']) {
        return -1;
    } else if ($a['gold'] > $b['gold']) {
        return 1;
    }
    if ($a['silver'] < $b['silver']) {
        return -1;
    } else if ($a['silver'] > $b['silver']) {
        return 1;
    }
    if ($a['bronze'] < $b['bronze']) {
        return -1;
    } else if ($a['bronze'] > $b['bronze']) {
        return 1;
    }
});



$i = 1;
foreach ($sortedData as $d) {
    if (!array_key_exists($d['abbr'], $existingData)) {
        $existingData[$d['abbr']] = array();
    }
    $d['medals_rank'] = $i;
    $existingData[$d['abbr']]['medals'] = $d;

    $i++;
}

file_put_contents('data.php', serialize($existingData));





