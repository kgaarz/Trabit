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
import de.trabit.reportApp.R

class MapActivity : AppCompatActivity(), OnMapReadyCallback,
    GoogleMap.OnMarkerClickListener {

    override fun onMarkerClick(p0: Marker?) = false

    private lateinit var map: GoogleMap
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var lastLocation: Location

    companion object {
        private const val LOCATION_PERMISSION_REQUEST_CODE = 1
    }

    // Erstellung der Routenpunkte
    //

    private fun setUpMap() {
        if (ActivityCompat.checkSelfPermission(this,
                android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                arrayOf(android.Manifest.permission.ACCESS_FINE_LOCATION), LOCATION_PERMISSION_REQUEST_CODE)
            return
        }

        map.isMyLocationEnabled = true

        fusedLocationClient.lastLocation.addOnSuccessListener(this) { location ->
            if (location != null) {
                lastLocation = location
                val currentLatLng = LatLng(location.latitude, location.longitude)
                map.animateCamera(CameraUpdateFactory.newLatLngZoom(currentLatLng, 15f))
            }
        }
 
        placeMarkerOnMap()
    }


    private fun placeMarkerOnMap() {
        val origin = LatLng(51.0355, 7.55231)
        val point0 = LatLng(51.023033, 7.566130)
        val destination = LatLng(50.943342, 6.958945)
        val bike = LatLng(51.0305, 7.55231)
        val car = LatLng(51.0325, 7.55231)
        val train = LatLng(51.023093, 7.566190)

        map.addMarker(MarkerOptions().position(origin).title("Start"))
        map.addMarker(MarkerOptions().position(point0).title("Umstieg auf Zug: RB25 Richtung Köln"))
        map.addMarker(MarkerOptions().position(destination).title("Ziel: HBF Köln"))
        map.addMarker(MarkerOptions().position(bike).title("Fahrrad").icon(BitmapDescriptorFactory.fromResource(R.mipmap.map_bike)))
        map.addMarker(MarkerOptions().position(car).title("Auto").icon(BitmapDescriptorFactory.fromResource(R.mipmap.map_car)))
        map.addMarker(MarkerOptions().position(train).title("Bahnstation").icon(BitmapDescriptorFactory.fromResource(R.mipmap.map_train)))
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
