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
import com.example.api_test.dataClasses.Comment
import com.example.api_test.dataClasses.Report
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import kotlinx.android.synthetic.main.activity_comments.*
import org.json.JSONException
import org.json.JSONObject
import de.trabit.reportApp.dataClasses.CreateComment




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
                    val comments = report.comments
                    comments_recycler_view.adapter = CommentsRecyclerAdapter(comments)
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