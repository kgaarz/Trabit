package de.trabit.reportApp

import ErrorSnackbar
import SuccessSnackbar
import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.api_test.dataClasses.Report
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import kotlinx.android.synthetic.main.activity_comments.*
import org.json.JSONException
import org.json.JSONObject
import de.trabit.reportApp.dataClasses.CreateComment
import java.text.SimpleDateFormat
import java.util.*


class CommentsActivity : AppCompatActivity() {
    //dummy username for MVP
    val username = "maxiboi"
    var commentCreated = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_comments)

        //get reportId
        println(intent.getStringExtra("report_id"))
        val reportId = intent.getStringExtra("report_id")

        val sendNewComment = findViewById<Button>(R.id.comment_send_button)
        var commentText = findViewById<EditText>(R.id.addComment).text

        // get comments
        getComments(reportId)

        // show success message after a comment has been added
        if(commentCreated) {
            SuccessSnackbar(linearLayout_comments).show("Kommentar wurde erfolgreich erstellt!")
        }

        //Intent on back arrow to finish activity
        val backButton = findViewById<ImageButton>(R.id.back_button)
        backButton.setOnClickListener {
                val backIntent = Intent(this,OverviewActivity::class.java)
                startActivity(backIntent)
        }

        //by click on 'sendNewComment' Button, check if something is typed in EditText
        sendNewComment.setOnClickListener {
            if(commentText.isNullOrBlank()) {
                ErrorSnackbar(linearLayout_comments).show("Bitte gebe einen Kommentartext ein!")
            } else {
                val comment = CreateComment(username, commentText.toString())
                postComment(reportId, comment)
            }
        }

        //init recyclerView
        val commentRecyclerView = findViewById<RecyclerView>(R.id.comments_recycler_view)
        commentRecyclerView.layoutManager = LinearLayoutManager(this, RecyclerView.VERTICAL, false)
    }

    private fun postComment(reportId : String, comment : CreateComment) {
        val requestUrl = BuildConfig.REPORTAPI_BASE_URL + "reports/" + reportId + "/comments"
        val reportObject = JSONObject(Gson().toJson(comment))
        val mQueue: RequestQueue = Volley.newRequestQueue(this)
        val request = JsonObjectRequest(Request.Method.POST, requestUrl, reportObject,
            Response.Listener {
                try {
                    val addCommentIntent = Intent(this, CommentsActivity::class.java)
                    startActivity(addCommentIntent)
                    commentCreated = true
                } catch (e: JSONException) {
                    e.printStackTrace()
                    ErrorSnackbar(linearLayout_comments).show("Kommentar konnte nicht erstellt werden!")
                }
            }, Response.ErrorListener {
                it.printStackTrace()
                val errorMsg = String(it.networkResponse.data, Charsets.UTF_8)
                ErrorSnackbar(linearLayout_comments).show(errorMsg)
            })
        mQueue.add(request)
    }

    private fun getComments(reportId : String) {
        val errorMessage = "Kommentare konnten nicht geladen werden!"
        val requestUrl = BuildConfig.REPORTAPI_BASE_URL + "reports/" + reportId
        val mQueue: RequestQueue = Volley.newRequestQueue(this)
        val request = JsonObjectRequest(Request.Method.GET, requestUrl, null,
            Response.Listener {
                try {
                    val gson = GsonBuilder().create()
                    val report = gson.fromJson(it.toString(), Report::class.java)

                    // TODO: refactor date formatting
                    // format date for report view
                    val dateFormatter = SimpleDateFormat("dd.MM.YYYY")
                    val today = Calendar.getInstance()
                    val yesterday = Calendar.getInstance()
                    yesterday.add(Calendar.DAY_OF_YEAR, -1)
                    val reportDate = when (dateFormatter.format(report.created))
                    {
                        dateFormatter.format(today.time) -> "Heute"
                        dateFormatter.format(today.time) -> "Gestern"
                        else -> dateFormatter.format(report.created)
                    }

                    // format time for report view
                    val timeFormatter = SimpleDateFormat("HH:MM")
                    val reportTime = timeFormatter.format(report.created)

                    // fill report overview with the corresponding values
                    username_text_comments_overview.text = report.author
                    report_text_comments_overview.text = report.description
                    id_text_comments_overview.text = report.transport.tag
                    day_text_comments_overview.text = reportDate
                    time_text_comments_overview.text = reportTime
                    voteNumber.text = (report.metadata.upvotes - report.metadata.downvotes).toString()

                    // send comments to adapter
                    comments_recycler_view.adapter = CommentsRecyclerAdapter(report.comments)
                } catch (e: JSONException) {
                    e.printStackTrace()
                    ErrorSnackbar(linearLayout_comments).show(errorMessage)
                }
            }, Response.ErrorListener {
                it.printStackTrace()
                ErrorSnackbar(linearLayout_comments).show(errorMessage)
            })
        mQueue.add(request)
    }
}