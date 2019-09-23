package de.trabit.reportApp

import android.view.View
import androidx.core.content.ContextCompat
import com.google.android.material.snackbar.Snackbar

class SuccessSnackbar (val view : View) {
    fun show(message : String) {
        val snackbar = Snackbar.make(this.view, message, Snackbar.LENGTH_LONG).setAction("OK"){}
        val colorGreen = ContextCompat.getColor(this.view.context, R.color.successGreen)
        val colorWhite = ContextCompat.getColor(this.view.context, R.color.colorWhite)
        snackbar.view.setBackgroundColor(colorGreen)
        snackbar.setActionTextColor(colorWhite)
        snackbar.show()
    }
}