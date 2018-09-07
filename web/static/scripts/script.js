$(document).ready(function(){
    $('#loader').css('visibility', 'hidden');
    $('#desc').hide();

    // Function handles site description button
    var helpFxn = function () {
        if ($('#desc').is(':hidden')) {
            $('#help').hide();
            $('#desc').show();
        }
        // Triggered when user clicks that they understand site description
        $('#gotit').click(function () {
            $('#desc').hide();
            $('#help').show();
        });
    };
 
    // POST request function
    var getData = function() { 
        $('#searchbox').hide();
        $('#searchresults').empty();
        $('.dropdown-menu').hide();
        $('#help').hide();
        $('#loader').show();
	    var concern = $('#concern').val();
        var city = $('#city').val();
        var distance = $('#distance').val()
        var info = {};

        info['concern'] = concern;
        info['city'] = city;
        info['distance'] = distance;
 
        if(info['concern'] == '' || info['city'] ==''){
            $('#loader').hide();
            $('#help').show();
            $('#searchbox').show();
            $('#searchresults').append(panelingHTML1 + 'Please enter both your dietary concern and your desired location to search for food.');
            $('#searchresults').append(panelingHTML2);
          } else {
                $.ajax({
                    type: 'POST',
                    url: '/search',
                    data: JSON.stringify(info),
                    contentType: 'application/json',
                    success: function(data) {
                        $('#help').show();
                        $('#searchresults').empty();
                        $('#searchbox').show();
                        $('#loader').css('visibility', 'hidden');
                        $('#eachbiz').empty();

                        let mydata = JSON.parse(data);

                        // Triggered when user does not enter valid input for Zipcode
                        if ($.isEmptyObject(mydata) == true) {
                            $('#searchresults').append(panelingHTML1 + 'Sorry, nothing came up! Please check that you are entering a valid United States zipcode and/or not entering a U.S. city.');;
                            $('#searchresults').append(panelingHTML2);
                            return
                        }

                        // Triggered when no search results come up, possibly due to user searching too small of an area
                        if (mydata['business'].length < 1 ){
                            $('#searchresults').append(panelingHTML1 + 'Sorry, nothing came up! Try widening your search.');
                            $('#searchresults').append(panelingHTML2);
                            return;
                        }

                        // Handles search results
                        for (let i = 0; i < data.length; i++) {
                            let stuff = mydata["business"][i];
                            var phoneStr = "";
                            var addrStr = "";
                            var city_info = "";
                            var listingURL = "";

                            // Try block for restaurant rating
                            try {
                                var rating = stuff['rating'] + ' &#9734 rating';
                            } catch(error) {
                                continue;
                            }
                            // Try block for listing's URL
                            try {
                                var listingURL = 'View on <a target="_blank" href="' + stuff['url'] + '">Yelp</a>';
                            } catch(error) {
                                continue;
                            }
                            // Try block for city and zipcode
                            try {
                                var city_info = stuff['city_info'];
                            } catch(error) {
                                continue;
                            }
                            // Try block for phone number
                            try {
                                typeof stuff['phone'];
                                var myPhone = stuff['phone'];
                                var makeCall = ">\u260F Call now!</a>";
                            } catch(error) {
                                var myPhone = "";
                                var  makeCall = makeCall.replace(">Call now!</a></p>", ">Don't call!</a></p>");
                            }
                            // String offers clickability so users can make a call directly from the site                             
                            var phoneStr = "<a href=" + "tel:" + myPhone + makeCall;
                            // Try block for street address
                            try {
                                typeof stuff['street'];
                                var addrStr = " @ " + stuff['street'];
                            } catch(error) {
                                continue;
                            }
                            // Try block for business name
                            try {
                                typeof stuff['name'];
                                var nameStr = stuff['name'];
                            } catch(error) {
                                continue;
                            }
                            
                            // Displays search results in separate Bootstrap panels
                            $('#searchresults').append(panelingHTML1 + '<div class="col"><h3>' + nameStr + '</h3>' + addrStr + '<br>' + city_info + '</div><div class="col text-right">' + listingURL + '<br>' + rating + '<br>' + phoneStr + '</div>');
                            $('#searchresults').append(panelingHTML2);
        
                        }
                    }, // AJAX success fxn ends
                }); // AJAX call ends

            } // Else statement for user entering a successful query ends

           $('#loader').css('visibility', 'visible');

         return false;
    }

    // Handles hiding/showing drop-down when button is clicked
    $('#arrow').click(function () {
        if ($('.dropdown-menu').is(':visible')) {
            $('.dropdown-menu').hide();
        }
        else if ($('.dropdown-menu').is(':hidden')) {
            $('.dropdown-menu').show();
        }
    });

    // Calls function that makes POST request to site's backend for API call
    $('#search').click(getData);

    // Function provides a description of ChowSafely if user needs it
    $('#help').click(helpFxn);

    // Basic Bootstrap paneling HTML for search results
    var panelingHTML1 = "<div class='panel panel-default' id='panel1'><div class='panel-body'><div class='row'>";
    var panelingHTML2 = '</div></div></div>';


 });
