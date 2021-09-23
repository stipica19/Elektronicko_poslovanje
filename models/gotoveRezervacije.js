import mongoose from "mongoose";

const gotovaRezervacijaSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    grad: {
      type: String,
    },
    dimenzija: {
      type: String,
    },
    opis: {
      type: String,
    },
    cijena: {
      type: Number,
      // required: true,
    },
    odDatuma: {
      type: Date,
      // required: true,
    },
    doDatuma: {
      type: Date,
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

const gotovaRezervacija = mongoose.model(
  "gotovaRezervacija",
  gotovaRezervacijaSchema
);

export default gotovaRezervacija;
