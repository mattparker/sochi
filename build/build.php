<?php


$dataStr = file_get_contents('data.php');
$data = unserialize($dataStr);
file_put_contents('../site/js/sochi-data.js', 'var SOCHIDATA = ' . json_encode($data));

// now make country pages


$tags = [
    'country_name', 'image_name',
    'abbr',
    'medals.gold_circlesize', 'medals.silver_circlesize', 'medals.bronze_circlesize',
    'medals.gold', 'medals.silver', 'medals.bronze',     'country_description',
    'medals.medals_percent',
    'cpi_percent',
    'hdi_percent',
    'medals.medals_rank',
    'cpi_rank',
    'hdi_rank'
];


foreach ($data as $abbr => $countryData) {

    if (!array_key_exists('medals', $countryData)) {
        continue;
    }

    $cTemp = file_get_contents('country_template.html');
    $cTemp = str_replace('{{abbr}}', $abbr, $cTemp);

    foreach ($tags as $t) {
        //echo $t . ": " . getData($countryData, $t) . "\n";
        $cTemp = str_replace('{{' . $t . '}}', getData($countryData, $t), $cTemp);

    }

    // now get picture
    require_once("../phpFlickr-3.1/phpFlickr.php");
    $flickr = new phpFlickr("035a5abf4cc024985655def190e1ecb4");
    $pic = $flickr->photos_search(array(
        'text' => 'Sochi medal ' . $countryData['country_name'],
        'per_page' => 1,

    ));
    $photo = $pic['photo'][0];
    $owner = $flickr->people_getInfo($photo['owner']);

    $picString = '<img src="http://farm' . $photo['farm'] . '.staticflickr.com/'
        . $photo['server'] . '/' . $photo['id'] . '_' . $photo['secret']
        . '_b.jpg" alt="photo from Flickr"/>';
    $picString .= "<a href='http://www.flickr.com/photos/" . $photo['owner'] . "/" . $photo['id'] . "/'>";
    $picString .= $photo['title'];
    $picString .= "</a> Owner: ";
    $picString .= "<a href='http://www.flickr.com/people/" . $photo['owner'] . "/'>";
    $picString .= $owner['username'];
    $picString .= "</a><br>";



    $cTemp = str_replace('{{flickr_photo}}', $picString, $cTemp);

    $filename = cleanFileName($countryData);
    if ($filename) {
        file_put_contents('../site/country/' . $filename . '.html', $cTemp);
    }

}




function getData ($dataArr, $tag) {
    if (array_key_exists($tag, $dataArr)) {
        return $dataArr[$tag];
    }

    if ($tag == 'medals.medals_percent') {
        return (int)(($dataArr['medals']['medals_rank'] / 30) * 100);
    }
    if ($tag == 'cpi_percent') {
        return (($dataArr['cpi_rank'] / 150) * 100);
    }
    if ($tag == 'hdi_percent') {
        return (($dataArr['hdi_rank'] / 101) * 100);
    }

    if (strstr($tag, '.')) {
        $parts = explode('.', $tag);
        if (array_key_exists($parts[0], $dataArr)) {
            if (array_key_exists($parts[1], $dataArr[$parts[0]])) {
                return $dataArr[$parts[0]][$parts[1]];
            }
        }
    }


    return 'umm..';
}



function cleanFileName ($countryData) {
    if (!array_key_exists('country_name', $countryData)) {
        return false;
    }
    return str_replace(" ", "_", $countryData['country_name']);
}