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
    private lateinit var carBtn : ImageButton
    private lateinit var trainBtn : ImageButton
    private lateinit var tramBtn : ImageButton
    private lateinit var busBtn : ImageButton

    override fun onCommentClick(position: Int) {
        val commentIntent = Intent(this, CommentsActivity::class.java)
        commentIntent.putExtra("report_id", reportList[position]._id)
        startActivity(commentIntent)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_overview)

        // get intent extras from report creation
        val reportTransportType = intent.getStringExtra("reportTransportType")
        val reportCreated = intent.getBooleanExtra("reportCreated", false)
        if (reportCreated) {
            SuccessSnackbar(linearLayout_main).show("Störungsmledung wurde erstellt!")
        }
        val reportDeleted = intent.getBooleanExtra("reportDeleted", false)
        if (reportDeleted) {
            SuccessSnackbar(linearLayout_main).show("Die Störung wurde beendet!")
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

        // add report (plus button)
        val addButton = findViewById<ImageButton>(R.id.addButton)
        addButton.setOnClickListener {
            val addReportIntent = Intent(this, FirstAddActivity::class.java)
            startActivity(addReportIntent)
        }

        // navigation icons (active mode)
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

        // change location textView to manually set location (if exists)
        val locationTitle = findViewById<TextView>(R.id.locationHeader)
        val manualLocationTitle = intent.getStringExtra("newLocation")
        if (manualLocationTitle !== null) {
            locationTitle.text = manualLocationTitle
        }

        // link location ImageButton to SearchActivity
        val locationBtn = findViewById<RelativeLayout>(R.id.location_change_relative_layout)
        locationBtn.setOnClickListener {
            val intent = Intent(this, SearchActivity::class.java)
            startActivity(intent)
        }

        // set location string
        val location = locationTitle.text.toString()

        // find views by ID for onClickListeners
        carBtn = findViewById(R.id.carIcon)
        trainBtn = findViewById(R.id.trainIcon)
        tramBtn = findViewById(R.id.tramIcon)
        busBtn = findViewById(R.id.busIcon)

        //set active tab
        when (reportTransportType) {
            "train"     -> setActiveTab("train", location)
            "subway"    -> setActiveTab("subway", location)
            "bus"       -> setActiveTab("bus", location)
            "car"       -> setActiveTab("car", location)
            else        -> setActiveTab("train", location)
        }

        // add onClickListeners to ImageButtons to change active tab
        carBtn.setOnClickListener {setActiveTab("car", location)}
        trainBtn.setOnClickListener {setActiveTab("train", location)}
        tramBtn.setOnClickListener {setActiveTab("subway", location)}
        busBtn.setOnClickListener {setActiveTab("bus", location)}
    }

    private fun setActiveTab (transportType : String, location : String) {
        when (transportType) {
            "train" -> {
                trainBtn.setImageResource(R.mipmap.train_icon_clicked)
                carBtn.setImageResource(R.mipmap.car_icon_grey)
                tramBtn.setImageResource(R.mipmap.tram_icon_grey)
                busBtn.setImageResource(R.mipmap.bus_icon_grey)
                getReports(ReportRequestParameters(location, "train", null, null))}
            "subway" -> {
                tramBtn.setImageResource(R.mipmap.tram_icon_clicked)
                carBtn.setImageResource(R.mipmap.car_icon_grey)
                trainBtn.setImageResource(R.mipmap.train_icon_grey)
                busBtn.setImageResource(R.mipmap.bus_icon_grey)
                getReports(ReportRequestParameters(location, "subway", null, null))}
            "bus" -> {
                busBtn.setImageResource(R.mipmap.bus_icon_clicked)
                carBtn.setImageResource(R.mipmap.car_icon_grey)
                trainBtn.setImageResource(R.mipmap.train_icon_grey)
                tramBtn.setImageResource(R.mipmap.tram_icon_grey)
                getReports(ReportRequestParameters(location, "bus", null, null))}
            "car" -> {
                carBtn.setImageResource(R.mipmap.car_icon_clicked)
                trainBtn.setImageResource(R.mipmap.train_icon_grey)
                tramBtn.setImageResource(R.mipmap.tram_icon_grey)
                busBtn.setImageResource(R.mipmap.bus_icon_grey)
                getReports(ReportRequestParameters(location, "car", null, null))}
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