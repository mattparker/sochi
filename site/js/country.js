YUI().use("jsonp", function (Y) {


    var url = 'http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=9008b808eac69f30e00741785e14e15c&text={query}&per_page=1&format=json&auth_token=72157641342745355-89c68c21f77e12a5&api_sig=c9e6f824930eb2f697bcb7626e451549',
        country = window.location.pathname.substr(window.location.pathname.lastIndexOf('/')+1).replace("_", " ").replace(".html", "");

    url = url.replace("{query}", "Sochi " + country);


    Y.jsonp(url, function (){
        console.log(arguments);
    })
});