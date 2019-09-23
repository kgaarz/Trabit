package de.trabit.reportApp

import android.support.design.widget.Snackbar
import android.support.v4.content.ContextCompat
import android.view.View

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