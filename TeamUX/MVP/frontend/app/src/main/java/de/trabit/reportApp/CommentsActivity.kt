package de.trabit.reportApp

import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView

class CommentsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_comments)

        val sendNewComment = findViewById<Button>(R.id.comment_send_button)
        val addComment = findViewById<EditText>(R.id.addComment)
        val commentText = addComment.getText()


        //Intent on back arrow to finish activity

        val backButton = findViewById<ImageButton>(R.id.back_button)

        backButton.setOnClickListener {
                val backIntent = Intent(this,OverviewActivity::class.java)
                startActivity(backIntent)
        }

        //by click on 'sendNewComment' Button, check if something is typed in EditText

        addComment.setOnClickListener {

            if (commentText.isBlank()) {
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


   private fun addComment(){

       //add Comment to database!!

   }
}
