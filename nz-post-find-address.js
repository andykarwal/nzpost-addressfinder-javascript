jQuery(function ($) {

    let input_1 = $("#autocomplete-nzpost");

    function autocomplete(inp, address_dpid) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("keyup", function (e) {
            input_1.attr('disabled', 'disabled');
            let a, b, i, arr, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) {
                return false;
            }
            currentFocus = -1;

            if (val.length > 8) {
                loading();
                new Promise(function (resolve, reject) {
                    let data = {
                        val: val
                    };

                    $.ajax({
                        url: window.location.origin +
                        '/wp-content/themes/h2t-child/api/nzPostAddressFinder.php',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        type: "POST",
                        dataType: "json",
                        crossDomain: true,
                        data: data,
                        success: function (result) {
                            if (result) {
                                resolve(result);
                            }
                            else {
                                $('#overlay').remove();
                            }
                        }
                    });
                }).then(function (result) {
                    console.log(result);
                    closeAllLists();
                    let listOfAdd = [];
                    let dpidOfAdd = [];
                    for (let j = 0; j < result.length; j++) {
                        listOfAdd.push(result[j].full_address)
                        dpidOfAdd.push(result[j].address_id)
                    }

                    console.log(listOfAdd);
                    arr = listOfAdd;
                    /*create a DIV element that will contain the items (values):*/
                    a = document.createElement("DIV");
                    a.setAttribute("id", this.id + "autocomplete-list");
                    a.setAttribute("class", "autocomplete-items");
                    /*append the DIV element as a child of the autocomplete container:*/
                    inp.parentNode.appendChild(a);
                    /*for each item in the array...*/
                    for (i = 0; i < arr.length; i++) {
                        /*create a DIV element for each matching element:*/
                        b = document.createElement("DIV");
                        b.setAttribute("class", "at-item");
                        /*make the matching letters bold:*/
                        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                        b.innerHTML += arr[i].substr(val.length);
                        /*insert a input field that will hold the current array item's value:*/
                        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                        b.innerHTML += "<input type='hidden' value='" + dpidOfAdd[i] + "'>";
                        /*execute a function when someone clicks on the item value (DIV element):*/
                        b.addEventListener("click", function (e) {
                            /*insert the value for the autocomplete text field:*/
                            inp.value = this.getElementsByTagName("input")[0].value;
                            address_dpid.value = this.getElementsByTagName("input")[1].value;
                            $($(inp)[0].parentElement.previousElementSibling).val(inp.value);
                            // $("#autocomplete-ajax").trigger('focus');
                            // $("#autocomplete-ajax").simulate('keydown', { keyCode: $.ui.keyCode.DOWN } ).simulate('keydown', { keyCode: $.ui.keyCode.ENTER });

                            /*close the list of autocompleted values,
                            (or any other open lists of autocompleted values:*/
                            closeAllLists();
                        });
                        a.appendChild(b);
                    }
                    $('#overlay').remove();
                });
            }


        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
            }
        });

        function addActive(x) {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-active");
        }

        function removeActive(x) {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }

        function closeAllLists(elmnt) {
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }

        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }

    let address_1 = document.getElementById("local-address-1");
    let address_1_dpid = document.getElementById("local-address-1-dpid");
    autocomplete(address_1, address_1_dpid);

    function loading() {
        // add the overlay with loading image to the page
        var over = '<div id="overlay">' +
            '<img id="loading" src="' +
            window.location.origin +
            '/wp-content/themes/h2t-child/img/loading.gif">' +
            '</div>';
        $(over).appendTo('body');
    };
});
