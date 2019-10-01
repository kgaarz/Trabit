package de.trabit.directionsApp

import ErrorSnackbar
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.DatePicker
import android.widget.ImageButton
import android.widget.TimePicker
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import com.google.android.libraries.places.api.model.Place
import com.google.android.libraries.places.widget.AutocompleteSupportFragment
import com.google.android.libraries.places.widget.listener.PlaceSelectionListener
import java.util.*
import com.google.android.gms.common.api.Status
import com.google.android.libraries.places.api.Places
import de.trabit.reportApp.R
import de.trabit.reportApp.comments.CommentsActivity
import de.trabit.reportApp.reports.display.OverviewActivity
import de.trabit.reportApp.user.profile.ProfileActivity
import kotlinx.android.synthetic.main.activity_directions.*
import kotlinx.android.synthetic.main.activity_map.*


class DirectionsActivity : AppCompatActivity() {

    var year: Int = 0
    var month: Int= 0
    var day: Int= 0
    var hour: Int= 0
    var minute: Int= 0
    var timestamp: Long= 0
    var originLat: Double = 0.0
    var originLong: Double = 0.0
    var destinationLat: Double = 0.0
    var destinationLong: Double = 0.0

    @RequiresApi(Build.VERSION_CODES.M)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_directions)


        // Get current calendar date and time.
        val currCalendar = Calendar.getInstance()
        currCalendar.setTimeZone(TimeZone.getTimeZone("Europe/Berlin"))

        year = currCalendar.get(Calendar.YEAR)
        month = currCalendar.get(Calendar.MONTH)
        day = currCalendar.get(Calendar.DAY_OF_MONTH)
        hour = currCalendar.get(Calendar.HOUR_OF_DAY)
        minute = currCalendar.get(Calendar.MINUTE)
        timestamp = currCalendar.getTimeInMillis()
        timestamp /= 1000

        // Get date picker object.
        val datePicker = findViewById(R.id.datePicker) as DatePicker
        datePicker.init(
            year, month, day
        ) { datePicker, year, month, day ->
            this@DirectionsActivity.year = year
            this@DirectionsActivity.month = month
            this@DirectionsActivity.day = day

            currCalendar.set(year, month, day, this@DirectionsActivity.hour, this@DirectionsActivity.minute)

            this@DirectionsActivity.timestamp = currCalendar.getTimeInMillis()
            this@DirectionsActivity.timestamp /= 1000


        }

        // Get time picker object.
        val timePicker = findViewById(R.id.timePicker) as TimePicker
        timePicker.hour = this.hour
        timePicker.minute = this.minute

        timePicker.setOnTimeChangedListener { timePicker, hour, minute ->
            this@DirectionsActivity.hour = hour
            this@DirectionsActivity.minute = minute

            currCalendar.set(this@DirectionsActivity.year, this@DirectionsActivity.month, this@DirectionsActivity.day, hour, minute)

            this@DirectionsActivity.timestamp = currCalendar.getTimeInMillis()
            this@DirectionsActivity.timestamp /= 1000
        }

        timePicker.setIs24HourView(true)

        initPlaces()


        //navigation
        val overviewIcon = findViewById(R.id.overviewNavigation) as ImageButton
        val profileIcon = findViewById(R.id.profileNavigation) as ImageButton
        val directionsIcon = findViewById(R.id.directonsNavigation) as ImageButton
        //val mapIcon = findViewById(R.id.mapNavigation) as ImageButton

        overviewIcon.setOnClickListener{
            val overviewReportsIntent = Intent(this, OverviewActivity::class.java)
            startActivity(overviewReportsIntent)
            overviewIcon.setImageResource(R.mipmap.overview_active)
            profileIcon.setImageResource(R.mipmap.profile)

        }

        profileIcon.setOnClickListener{
            val profileIconIntent = Intent(this, ProfileActivity::class.java)
            startActivity(profileIconIntent)
            profileIcon.setImageResource(R.mipmap.profile_active)
            overviewIcon.setImageResource(R.mipmap.overview)
        }

        directionsIcon.setOnClickListener {
            val intent = Intent(this, DirectionsActivity::class.java)
            startActivity(intent)
            directionsIcon.setImageResource(R.mipmap.directions_icon_active)
            overviewIcon.setImageResource(R.mipmap.overview)
            profileIcon.setImageResource(R.mipmap.profile)
        }

        /*mapIcon.setOnClickListener {
            val mapIntent = Intent(this, MapActivity::class.java)
            startActivity(mapIntent)
        }*/




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
                    this@DirectionsActivity.originLat = place.latLng?.latitude ?: 0.0
                    this@DirectionsActivity.originLong = place.latLng?.longitude ?: 0.0

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
                    this@DirectionsActivity.destinationLat = place.latLng?.latitude ?: 0.0
                    this@DirectionsActivity.destinationLong = place.latLng?.longitude ?: 0.0
                }

                fun onError() {
                    // TODO: Handle the error.
                    Log.i("TAG", "An error occurred")
                }
            })
        }

        val createRouteButton = findViewById(R.id.buttonCreateRoute) as Button



            createRouteButton.setOnClickListener {

                if(this.originLat != 0.0 || this.destinationLat != 0.0) {
                val extras = Bundle()
                extras.putLong("TIMESTAMP", this.timestamp)
                extras.putDouble("ORIGIN_LAT", this.originLat)
                extras.putDouble("ORIGIN_LONG", this.originLong)
                extras.putDouble("DESTINATION_LAT", this.destinationLat)
                extras.putDouble("DESTINATION_LONG", this.destinationLong)

                val intent = Intent(this, DirectionSelectionActivity::class.java)

                intent.putExtras(extras)

                startActivity(intent)
                } else {
                    ErrorSnackbar(linearLayout_directions).show("Bitte gebe Start und Ziel an!")
                }
            }

    }

    fun initPlaces(){
        // Initialize the SDK
        Places.initialize(applicationContext, "AIzaSyCZVkrJkiRNaIS3f60yWWKRNjdfGbdGayI")

        // Create a new Places client instance
        val placesClient = Places.createClient(this)
    }
}

