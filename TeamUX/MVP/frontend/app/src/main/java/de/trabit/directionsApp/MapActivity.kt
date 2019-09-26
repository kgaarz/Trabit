package de.trabit.directionsApp

import android.content.pm.PackageManager
import android.location.Location
import android.os.Bundle
import android.util.Log
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
import org.json.JSONArray
import org.json.JSONObject

class MapActivity : AppCompatActivity(), OnMapReadyCallback,
    GoogleMap.OnMarkerClickListener {

    override fun onMarkerClick(p0: Marker?) = false

    private lateinit var map: GoogleMap
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var lastLocation: Location

    companion object {
        private const val LOCATION_PERMISSION_REQUEST_CODE = 1
    }

    // Auslese der Routenpunkte
    private val origin = LatLng(50.941357, 6.958307)
    private val point0 = LatLng(50.943302, 6.958905)
    private val destination = LatLng(51.023220, 7.566177)


    private fun setUpMap() {
        if (ActivityCompat.checkSelfPermission(this,
                android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                arrayOf(android.Manifest.permission.ACCESS_FINE_LOCATION), LOCATION_PERMISSION_REQUEST_CODE)
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

        val asyncTask = RequestActivity.GetRequest(applicationContext, "mobilities", "5d5c07108bb94088c3447236")
        asyncTask.execute()

        val data = asyncTask.get().get("data").toString()
        val jsonData = JSONObject(data)
        placeMarkerOnMap(jsonData)
    }


    private fun placeMarkerOnMap(data: JSONObject) {
        //Auslese der Mobilitätsmöglichkeiten im Umkreis

        val cars = data.getJSONArray("cars")
        (0 until cars.length() -1).forEach { i ->
            val lat = cars.getJSONObject(i).getJSONObject("geoLocation").getDouble("lat")
            val lng = cars.getJSONObject(i).getJSONObject("geoLocation").getDouble("lng")
            val car = LatLng(lat, lng)
            map.addMarker(MarkerOptions().position(car).title("Auto").icon(BitmapDescriptorFactory.fromResource(R.mipmap.map_car)))
        }

        val bikes = data.getJSONArray("bikes")
        (0 until bikes.length() -1).forEach { i ->
            val lat = bikes.getJSONObject(i).getJSONObject("geoLocation").getDouble("lat")
            val lng = bikes.getJSONObject(i).getJSONObject("geoLocation").getDouble("lng")
            val bike = LatLng(lat, lng)
            map.addMarker(MarkerOptions().position(bike).title("Fahrrad").icon(BitmapDescriptorFactory.fromResource(R.mipmap.map_bike)))
        }

        val transits = data.getJSONArray("transits")
        (0 until transits.length() -1).forEach { i ->
            val lat = transits.getJSONObject(i).getJSONObject("geoLocation").getDouble("lat")
            val lng = transits.getJSONObject(i).getJSONObject("geoLocation").getDouble("lng")
            val transit = LatLng(lat, lng)
            map.addMarker(MarkerOptions().position(transit).title("Bahnstation").icon(BitmapDescriptorFactory.fromResource(R.mipmap.map_train)))
        }

        map.addMarker(MarkerOptions().position(origin).title("Start").icon(BitmapDescriptorFactory.fromResource(R.mipmap.map_start)))
        map.addMarker(MarkerOptions().position(point0).title("Umstieg auf Zug: RB25 Richtung Köln").icon(BitmapDescriptorFactory.fromResource(R.mipmap.map_step)))
        map.addMarker(MarkerOptions().position(destination).title("Ziel: HBF Köln").icon(BitmapDescriptorFactory.fromResource(R.mipmap.map_ziel)))

    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_map)
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        val mapFragment = supportFragmentManager
            .findFragmentById(R.id.map) as SupportMapFragment
        mapFragment.getMapAsync(this)

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
    }

    override fun onMapReady(googleMap: GoogleMap) {
        map = googleMap

        map.getUiSettings().setZoomControlsEnabled(true)
        map.setOnMarkerClickListener(this)

        setUpMap()
    }
}
