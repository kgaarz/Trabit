package de.trabit.reportApp

import SuccessSnackbar
import ErrorSnackbar
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
import com.example.api_test.dataClasses.*
import com.google.gson.Gson
import kotlinx.android.synthetic.main.activity_comments.*
import kotlinx.android.synthetic.main.activity_overview.*
import kotlinx.android.synthetic.main.activity_third_add.*
import org.json.JSONException
import org.json.JSONObject
import android.icu.lang.UCharacter.GraphemeClusterBreak.T
import de.trabit.reportApp.dataClasses.CommentPOST
import kotlinx.android.synthetic.main.activity_second_add.*
import java.text.SimpleDateFormat


class CommentsActivity : AppCompatActivity() {

    var commentCreated = false


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_comments)


        val sendNewComment = findViewById(R.id.comment_send_button) as Button
        val addComment = findViewById(R.id.addComment) as EditText
        val commentText : String = addComment.getText().toString()


        //success message by adding a comment

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
                // SAMPLE DATA!!
                val comment = CommentPOST("maxmuster",commentText)
                postComment(comment)
        }

        //init recyclerView

        val commentRecyclerView = findViewById<RecyclerView>(R.id.comments_recycler_view)
        commentRecyclerView.layoutManager = LinearLayoutManager(this, RecyclerView.VERTICAL, false)

        //dummydata for the recyclerview

        val comments = ArrayList<CommentsItem>()
        comments.add(CommentsItem("heute","10.00 Uhr","maramuster","Verspätet sich noch weiterhin","2"))
        comments.add(CommentsItem("heute","09.30 Uhr","milenamuster","Fällt jetzt komplett aus","0"))

        //add the adapter to the recyclerView
        val adapter = CommentsRecyclerAdapter(comments)
        commentRecyclerView.adapter = adapter
    }

    private fun postComment(comment : CommentPOST) {
        //get reportId
        val reportId = intent.getStringExtra("report_id").toString()
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
}
