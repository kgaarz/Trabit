package de.trabit.reportApp.reports.display

import ErrorSnackbar
import SuccessSnackbar
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.*
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.Response
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.Volley
import com.example.api_test.dataClasses.Report
import com.example.api_test.dataClasses.ReportRequestParameters
import com.google.gson.GsonBuilder
import kotlinx.android.synthetic.main.activity_overview.*
import org.json.JSONException
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import de.trabit.directionsApp.DirectionsActivity
import de.trabit.directionsApp.MapActivity
import de.trabit.reportApp.*
import de.trabit.reportApp.changelocation.SearchActivity
import de.trabit.reportApp.comments.CommentsActivity
import de.trabit.reportApp.user.profile.ProfileActivity
import de.trabit.reportApp.reports.add.FirstAddActivity
import de.trabit.reportApp.voting.VotingView

class OverviewActivity : AppCompatActivity(), ReportRecyclerAdapter.OnCommentListener, VotingView {
    private lateinit var reportList: Array<Report>

    override fun onCommentClick(position: Int) {
        val commentIntent = Intent(this, CommentsActivity::class.java)
        commentIntent.putExtra("report_id", reportList[position]._id)
        startActivity(commentIntent)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_overview)


        // get intent extra from report creation
        val reportCreated = intent.getBooleanExtra("reportCreated", false)
        if (reportCreated) {
            SuccessSnackbar(linearLayout_main).show("Störungsmledung wurde erfolgreich erstellt!")
        }

        // init layout objects
        val recyclerView = findViewById<RecyclerView>(R.id.recycler_view)
        recyclerView.layoutManager = LinearLayoutManager(this, RecyclerView.VERTICAL, false)

        // filter reports via searchView
        val searchView = findViewById<SearchView>(R.id.search_view)
        searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(p0: String?): Boolean {
                return false
            }

            override fun onQueryTextChange(p0: String?): Boolean {
                //ReportRecyclerAdapter(reports)?.filter?.filter(p0)
                return false
            }
        })

        //Add Intent to firstAddActivity to add a report (plus button)
        val addButton = findViewById<ImageButton>(R.id.addButton)
        addButton.setOnClickListener {
            val addReportIntent = Intent(this, FirstAddActivity::class.java)
            startActivity(addReportIntent)
        }

        //Navigation Icons (active mode)
        val overviewIcon = findViewById<ImageButton>(R.id.overviewNavigation)
        val profileIcon = findViewById<ImageButton>(R.id.profileNavigation)
        val directionsIcon = findViewById<ImageButton>(R.id.directonsNavigation)
        val mapIcon = findViewById<ImageButton>(R.id.mapNavigation)

        overviewIcon.setOnClickListener {
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
        }

        mapIcon.setOnClickListener {
            val intent = Intent(this, MapActivity::class.java)
            startActivity(intent)
        }

        //store the value (chosen city) via Intent from the SearchActivity in a variable
        val locationTitle = findViewById<TextView>(R.id.locationHeader)
        val manuallyLocationTitle = intent.getStringExtra("newLocation")

        //if a value has been submitted via intent than change the Location Textview accordingly to the passed value from the intent
        if (manuallyLocationTitle !== null) {
            locationTitle.text = manuallyLocationTitle
        }

        //Find View By Id for ClickListener Add Clicklistener to Imagebutton (Location) and link to SearchActivity
        val locationBtn = findViewById<RelativeLayout>(R.id.location_change_relative_layout)

        locationBtn.setOnClickListener {
            val intent = Intent(this, SearchActivity::class.java)
            startActivity(intent)
        }

        // set location string
        val location = locationTitle.text.toString()

        //Find Views By Id for ClickListener
        val carBtn = findViewById<ImageButton>(R.id.carIcon)
        val trainBtn = findViewById<ImageButton>(R.id.trainIcon)
        val tramBtn = findViewById<ImageButton>(R.id.tramIcon)
        val busBtn = findViewById<ImageButton>(R.id.busIcon)

        //Set the train Button default on clicked
        trainBtn.setImageResource(R.mipmap.train_icon_clicked)
        var transportType = "train"
        getReports(ReportRequestParameters(location, transportType, null, null))

        //Add Clicklistener to Imagebuttons (Car, bus, train, tram icon) to Change Color of Image (Clicked)
        carBtn.setOnClickListener {
            carBtn.setImageResource(R.mipmap.car_icon_clicked)
            trainBtn.setImageResource(R.mipmap.train_icon_grey)
            tramBtn.setImageResource(R.mipmap.tram_icon_grey)
            busBtn.setImageResource(R.mipmap.bus_icon_grey)
            transportType = "car"
            getReports(ReportRequestParameters(location, transportType, null, null))
        }

        trainBtn.setOnClickListener {
            trainBtn.setImageResource(R.mipmap.train_icon_clicked)
            carBtn.setImageResource(R.mipmap.car_icon_grey)
            tramBtn.setImageResource(R.mipmap.tram_icon_grey)
            busBtn.setImageResource(R.mipmap.bus_icon_grey)
            transportType = "train"
            getReports(ReportRequestParameters(location, transportType, null, null))
        }

        tramBtn.setOnClickListener {
            tramBtn.setImageResource(R.mipmap.tram_icon_clicked)
            carBtn.setImageResource(R.mipmap.car_icon_grey)
            trainBtn.setImageResource(R.mipmap.train_icon_grey)
            busBtn.setImageResource(R.mipmap.bus_icon_grey)
            transportType = "subway"
            getReports(ReportRequestParameters(location, transportType, null, null))
        }

        busBtn.setOnClickListener {
            busBtn.setImageResource(R.mipmap.bus_icon_clicked)
            carBtn.setImageResource(R.mipmap.car_icon_grey)
            trainBtn.setImageResource(R.mipmap.train_icon_grey)
            tramBtn.setImageResource(R.mipmap.tram_icon_grey)
            transportType = "bus"
            getReports(ReportRequestParameters(location, transportType, null, null))
        }
    }

    private fun getReports(params: ReportRequestParameters) {
        val rootUrl = BuildConfig.REPORTAPI_BASE_URL
        val requestUrl = rootUrl + "reports" + getQueryString(params)
        val mQueue: RequestQueue = Volley.newRequestQueue(this)
        val request = JsonArrayRequest(Request.Method.GET, requestUrl, null,
            Response.Listener {
                try {
                    val gson = GsonBuilder().create()
                    reportList = gson.fromJson(it.toString(), Array<Report>::class.java)
                    recycler_view.adapter =
                        ReportRecyclerAdapter(reportList, this)//?.filter?.filter("test")

                    // hide or show bg picture
                    if (reportList.isEmpty()) {
                        recycler_view.visibility = View.GONE
                        noReportsText1.visibility = View.VISIBLE
                        noReportsText2.visibility = View.VISIBLE
                        noReportsImage.visibility = View.VISIBLE
                    } else {
                        recycler_view.visibility = View.VISIBLE
                        noReportsText1.visibility = View.GONE
                        noReportsText2.visibility = View.GONE
                        noReportsImage.visibility = View.GONE
                    }
                } catch (e: JSONException) {
                    e.printStackTrace()
                    ErrorSnackbar(linearLayout_main).show("Daten konnten nicht geladen werden!")
                }
            }, Response.ErrorListener {
                it.printStackTrace()
                ErrorSnackbar(linearLayout_main).show("Daten konnten nicht geladen werden!")
            })
        mQueue.add(request)
    }

    private fun getQueryString(params: ReportRequestParameters): String {
        var queryString = "?originCity=${params.orignCity}&transportType=${params.transportType}"
        val addParam =
            { query: String, param: String? -> if (!param.isNullOrBlank()) "$query&$param" else query }
        queryString = addParam(queryString, params.transportTag)
        queryString = addParam(queryString, params.destinationCity)
        return queryString
    }

}