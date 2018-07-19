<?php

function authenticate()
{
    $serverURL = "https://oauth.nzpost.co.nz/as/token.oauth2";
    $cl = curl_init();
    curl_setopt($cl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($cl, CURLOPT_URL, $serverURL);
    curl_setopt($cl, CURLOPT_POST, true);
    /* uncomment this line if you don't have the required SSL certificates */
    curl_setopt($cl, CURLOPT_SSL_VERIFYPEER, false);
    $post_details = "grant_type=client_credentials";
    $post_details .= "&client_id=<client id here>";
    $post_details .= "&client_secret=< client secret here>";
    curl_setopt($cl, CURLOPT_POSTFIELDS, $post_details);
    $auth_response = curl_exec($cl);
    if ($auth_response === false) {
        echo "Failed to authenticate\n";
        curl_close($cl);
        return "failed";
    }
    curl_close($cl);
    return json_decode($auth_response, true);
}

function getAddressDpid()
{
    $address = $_POST['val'];

    $string = urlencode($address);
    $post_details = "?q=$string";
    $post_details .= "&count=6";

    $content = authenticate();
    $access_token = $content['access_token'];

    $api_live_url = "https://api.nzpost.co.nz/parceladdress/2.0/domestic/addresses";

    $ch = curl_init();
    $client_id = "";
    $client_secret = "";

    curl_setopt_array(
        $ch, array(
        CURLOPT_URL => $api_live_url . $post_details,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_HTTPHEADER => array(
            'client_id: ' . $client_id,
            'Authorization: Bearer ' . $access_token,
        )
    ));

    $result = curl_exec($ch);
    $result = json_decode($result);

    if ($result->success && !empty($result->addresses)) {
        $result = json_encode($result->addresses);
        echo $result;
    } else {
        echo false;
    }
}

getAddressDpid();
