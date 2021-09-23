import mongoose from "mongoose";

const lokacijaSchema = mongoose.Schema(
  {
    grad: {
      type: String,
      required: true,
    },
    adresa: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Lokacija = mongoose.model("Lokacija", lokacijaSchema);

export default Lokacija;
