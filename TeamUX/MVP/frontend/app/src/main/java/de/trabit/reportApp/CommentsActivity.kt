package de.trabit.reportApp

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.v7.widget.LinearLayoutManager
import android.support.v7.widget.RecyclerView
import android.widget.*

class CommentsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_comments)

        val sendNewComment = findViewById(R.id.comment_send_button) as Button
        val addComment = findViewById(R.id.addComment) as EditText
        val commentText = addComment.getText()


        //Intent on back arrow to finish activity

        val backButton = findViewById(R.id.back_button) as ImageButton

        backButton.setOnClickListener {
                val backIntent = Intent(this,OverviewActivity::class.java)
                startActivity(backIntent)
        }

        //by click on 'sendNewComment' Button, check if something is typed in EditText

        addComment.setOnClickListener {

            if (commentText.isEmpty() || commentText.length == 0 || commentText.equals("") || commentText == null) {
                val errorToast = Toast.makeText(
                    this@CommentsActivity,
                    "Bitte gib zunächst einen Kommentar ein.",
                    Toast.LENGTH_SHORT
                )
                errorToast.show()
            } else {
                addComment()
            }
        }

        //init recyclerView

        val commentRecyclerView = findViewById(R.id.comments_recycler_view) as RecyclerView
        commentRecyclerView.layoutManager = LinearLayoutManager(this, LinearLayout.VERTICAL, false)

        //dummydata for the recyclerview

        val comments = ArrayList<CommentsItem>()
        comments.add(CommentsItem("heute","10.00 Uhr","maramuster","Verspätet sich noch weiterhin","2"))
        comments.add(CommentsItem("heute","09.30 Uhr","milenamuster","Fällt jetzt komplett aus","0"))

        //add the adapter to the recyclerView

        val adapter = CommentsRecyclerAdapter(comments)
        commentRecyclerView.adapter = adapter
    }


   private fun addComment(){

       //add Comment to database!!

   }
}
