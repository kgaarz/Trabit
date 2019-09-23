package de.trabit.reportApp

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.ImageButton
import androidx.appcompat.app.AppCompatActivity
import com.google.android.libraries.places.api.model.Place
import com.google.android.libraries.places.widget.AutocompleteSupportFragment
import com.google.android.libraries.places.widget.listener.PlaceSelectionListener
import java.util.*
import com.google.android.gms.common.api.Status
import com.google.android.libraries.places.api.Places


class DirectionsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_directions)

        initPlaces()

        val overviewIcon = findViewById(R.id.overviewNavigation) as ImageButton
        val profileIcon = findViewById(R.id.profileNavigation) as ImageButton
        val directionsIcon = findViewById(R.id.directonsNavigation) as ImageButton


        overviewIcon.setOnClickListener{
            overviewIcon.setImageResource(R.mipmap.overview_active)
            profileIcon.setImageResource(R.mipmap.profile)
        }

        profileIcon.setOnClickListener{
            profileIcon.setImageResource(R.mipmap.profile_active)
            overviewIcon.setImageResource(R.mipmap.overview)
        }

        directionsIcon.setOnClickListener {
            val intent = Intent(this, DirectionsActivity::class.java)
            startActivity(intent);
        }


        val autocompleteFragmentOrigin = supportFragmentManager.findFragmentById(R.id.autocomplete_fragment_origin) as AutocompleteSupportFragment?
        val autocompleteFragmentDestination = supportFragmentManager.findFragmentById(R.id.autocomplete_fragment_destination) as AutocompleteSupportFragment?

        if (autocompleteFragmentOrigin != null) {
            autocompleteFragmentOrigin.setPlaceFields(Arrays.asList(Place.Field.ID, Place.Field.NAME,Place.Field.LAT_LNG))
        }

        if (autocompleteFragmentOrigin != null) {
            autocompleteFragmentOrigin.setOnPlaceSelectedListener(object: PlaceSelectionListener {
                override fun onError(p0: Status) {
                    TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
                }

                override fun onPlaceSelected(place: Place) {
                    // TODO: Get info about the selected place.
                    Log.i("TAG", "Place: " + place.latLng)
                }

                fun onError() {
                    // TODO: Handle the error.
                    Log.i("TAG", "An error occurred")
                }
            })
        }

        if (autocompleteFragmentDestination != null) {
            autocompleteFragmentDestination.setPlaceFields(Arrays.asList(Place.Field.ID, Place.Field.NAME,Place.Field.LAT_LNG))
        }

        if (autocompleteFragmentDestination != null) {
            autocompleteFragmentDestination.setOnPlaceSelectedListener(object: PlaceSelectionListener {
                override fun onError(p0: Status) {
                    TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
                }

                override fun onPlaceSelected(place: Place) {
                    // TODO: Get info about the selected place.
                    Log.i("TAG", "Place: " + place.latLng)
                }

                fun onError() {
                    // TODO: Handle the error.
                    Log.i("TAG", "An error occurred")
                }
            })
        }
    }

    fun initPlaces(){
        // Initialize the SDK
        Places.initialize(applicationContext, "AIzaSyCZVkrJkiRNaIS3f60yWWKRNjdfGbdGayI")

        // Create a new Places client instance
        val placesClient = Places.createClient(this)
    }

}

