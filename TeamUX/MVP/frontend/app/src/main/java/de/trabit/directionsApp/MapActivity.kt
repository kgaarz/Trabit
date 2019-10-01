package de.trabit.directionsApp

import android.content.Intent
import android.content.pm.PackageManager
import android.location.Location
import android.os.Bundle
import android.util.Log
import android.widget.ImageButton
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.BitmapDescriptorFactory
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.Marker
import com.google.android.gms.maps.model.MarkerOptions
import de.trabit.directionsApp.requestHelper.RequestActivity
import de.trabit.reportApp.R
import de.trabit.reportApp.reports.display.OverviewActivity
import de.trabit.reportApp.user.profile.ProfileActivity
import org.json.JSONArray
import org.json.JSONObject
//import com.rabbitmq.client.*
import java.util.*

class MapActivity : AppCompatActivity(), OnMapReadyCallback,
    GoogleMap.OnMarkerClickListener {

    override fun onMarkerClick(p0: Marker?) = false

    private lateinit var map: GoogleMap
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var lastLocation: Location

    companion object {
        private const val LOCATION_PERMISSION_REQUEST_CODE = 1
        const val EXCHANGE_NAME = "headers_logs"
    }

    private fun setUpMap() {
        if (ActivityCompat.checkSelfPermission(
                this,
                android.Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(android.Manifest.permission.ACCESS_FINE_LOCATION),
                LOCATION_PERMISSION_REQUEST_CODE
            )
            return
        }

        map.isMyLocationEnabled = true

        map.mapType = GoogleMap.MAP_TYPE_NORMAL

        fusedLocationClient.lastLocation.addOnSuccessListener(this) { location ->
            if (location != null) {
                lastLocation = location
                val currentLatLng = LatLng(location.latitude, location.longitude)
                map.animateCamera(CameraUpdateFactory.newLatLngZoom(currentLatLng, 15f))
            }
        }

        var mobilitiesId = "5d921d2936b0b100048798b5"
        var directionsId = "5d921d2e36b0b100048798b7"

        if( getIntent().getExtras() != null)
        {
            val intent = intent
            val extras = intent.extras
            var mobilitiesIdIntent:String? = extras.getString("MOBILITIES_ID")
            var directionsIdIntent:String? = extras.getString("DIRECTIONS_ID")

            if (mobilitiesIdIntent != null) {
                mobilitiesId = mobilitiesIdIntent
            }

            if (directionsIdIntent != null) {
                directionsId = directionsIdIntent
            }
        }

        // Mobilities im Umkreis abrufen
        val asyncTask =
            RequestActivity.GetRequest(applicationContext, "mobilities", "5d5c07108bb94088c3447236")
        asyncTask.execute()
        val mobilitiesData = asyncTask.get().getJSONObject("data")

        // Ausgewählte Route abrufen
        val asyncTask2 =
            RequestActivity.GetRequest(applicationContext, "directions", directionsId)
        asyncTask2.execute()
        val directionsData = asyncTask2.get().getJSONObject("data")
      //  createQueues(directionsData)
        placeMarkerOnMap(mobilitiesData, directionsData)
    }


    private fun placeMarkerOnMap(mobilitiesData: JSONObject, directionsData: JSONObject) {
        //Auslese der Mobilitätsmöglichkeiten im Umkreis

        val cars = mobilitiesData.getJSONArray("cars")
        (0 until cars.length() - 1).forEach { i ->
            val lat = cars.getJSONObject(i).getJSONObject("geoLocation").getDouble("lat")
            val lng = cars.getJSONObject(i).getJSONObject("geoLocation").getDouble("lng")
            val car = LatLng(lat, lng)
            map.addMarker(
                MarkerOptions().position(car).title("Auto").icon(
                    BitmapDescriptorFactory.fromResource(
                        R.mipmap.map_car
                    )
                )
            )
        }

        val bikes = mobilitiesData.getJSONArray("bikes")
        (0 until bikes.length() - 1).forEach { i ->
            val lat = bikes.getJSONObject(i).getJSONObject("geoLocation").getDouble("lat")
            val lng = bikes.getJSONObject(i).getJSONObject("geoLocation").getDouble("lng")
            val bike = LatLng(lat, lng)
            map.addMarker(
                MarkerOptions().position(bike).title("Fahrrad").icon(
                    BitmapDescriptorFactory.fromResource(R.mipmap.map_bike)
                )
            )
        }

        val transits = mobilitiesData.getJSONArray("transits")
        (0 until transits.length() - 1).forEach { i ->
            val lat = transits.getJSONObject(i).getJSONObject("geoLocation").getDouble("lat")
            val lng = transits.getJSONObject(i).getJSONObject("geoLocation").getDouble("lng")
            val transit = LatLng(lat, lng)
            map.addMarker(
                MarkerOptions().position(transit).title("Bahnstation").icon(
                    BitmapDescriptorFactory.fromResource(R.mipmap.map_train)
                )
            )
        }


        // Auslese der Routenpunkte

        val origin = LatLng(
            directionsData.getJSONObject("startLocation").getDouble("lat"),
            directionsData.getJSONObject("startLocation").getDouble("lng")
        )
        val destination = LatLng(
            directionsData.getJSONObject("endLocation").getDouble("lat"),
            directionsData.getJSONObject("endLocation").getDouble("lng")
        )
        map.addMarker(
            MarkerOptions().position(origin).title("Start").icon(
                BitmapDescriptorFactory.fromResource(
                    R.mipmap.map_start
                )
            )
        )
        map.addMarker(
            MarkerOptions().position(destination).title("Ziel").icon(
                BitmapDescriptorFactory.fromResource(R.mipmap.map_ziel)
            )
        )

        val steps = directionsData.getJSONArray("steps")
        if (steps.length() > 1) {
            (1 until steps.length() - 2).forEach { i ->
                val lat = steps.getJSONObject(i).getJSONObject("startLocation").getDouble("lat")
                val lng = steps.getJSONObject(i).getJSONObject("startLocation").getDouble("lng")
                val mode = steps.getJSONObject(i).getString("mode")
                val instructions = steps.getJSONObject(i).getString("instructions")
                val step = LatLng(lat, lng)
                map.addMarker(
                    MarkerOptions().position(step).title("Step,$i, $mode,$instructions").icon(
                        BitmapDescriptorFactory.fromResource(R.mipmap.map_step)
                    )
                )
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_map)
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        val mapFragment = supportFragmentManager
            .findFragmentById(R.id.map) as SupportMapFragment
        mapFragment.getMapAsync(this)

        // navigation icons (active mode)
        val overviewIcon = findViewById<ImageButton>(R.id.overviewNavigation)
        val profileIcon = findViewById<ImageButton>(R.id.profileNavigation)
        val directionsIcon = findViewById<ImageButton>(R.id.directonsNavigation)
        val mapIcon = findViewById<ImageButton>(R.id.mapNavigation)

        overviewIcon.setOnClickListener {
            val overviewIntent = Intent(this, OverviewActivity::class.java)
            startActivity(overviewIntent)
            overviewIcon.setImageResource(R.mipmap.overview_active)
            profileIcon.setImageResource(R.mipmap.profile)
        }

        profileIcon.setOnClickListener {
            val profileIntent = Intent(this, ProfileActivity::class.java)
            startActivity(profileIntent)
            profileIcon.setImageResource(R.mipmap.profile_active)
            overviewIcon.setImageResource(R.mipmap.overview)
        }

        directionsIcon.setOnClickListener {
            // Handler code here.
            val intent = Intent(this, DirectionsActivity::class.java)
            startActivity(intent)
            directionsIcon.setImageResource(R.mipmap.directions_icon_active)
            overviewIcon.setImageResource(R.mipmap.overview)
            profileIcon.setImageResource(R.mipmap.profile)
        }

        mapIcon.setOnClickListener {
            mapIcon.setImageResource(R.drawable.ic_map_blue_24dp)
            profileIcon.setImageResource(R.mipmap.profile)
        }


        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
    }

    override fun onMapReady(googleMap: GoogleMap) {
        map = googleMap

        map.getUiSettings().setZoomControlsEnabled(true)
        map.setOnMarkerClickListener(this)

        setUpMap()
    }
/*
    private fun createQueues(directionsData: JSONObject) {
        var directionId = directionsData.getJSONObject("id")
        var steps = directionsData.getJSONArray("steps")
        val factory = ConnectionFactory()
        factory.host = "localhost"
        val connection = factory.newConnection()
        val channel = connection.createChannel()

        channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.HEADERS)

        val routingKeyFromUser = ""
        //x-match und any hinzufügen

        var header = mutableMapOf<String, Any>();
        (0 until steps.length()).forEach { i ->
            header.put(directionId.toString(),i)
        }
        header.put("x-match", "any")
        println(header)
        val queueName = channel.queueDeclare().queue
        channel.queueBind(queueName, EXCHANGE_NAME, routingKeyFromUser, header)

        println("gestartet")

        val consumer = object : DefaultConsumer(channel) {
            override fun handleDelivery(
                consumerTag: String, envelope: Envelope,
                properties: AMQP.BasicProperties, body: ByteArray
            ) {
                val message = String(body, charset("UTF-8"))
                System.out.println(" [x] Received '" + envelope.routingKey + "':'" + message + "'")
                Toast.makeText(this@MapActivity, message.toString(), Toast.LENGTH_SHORT).show()
            }
        }
        channel.basicConsume(queueName, true, consumer)
    }*/
}
