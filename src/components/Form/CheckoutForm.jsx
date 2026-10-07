/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

import "./CheckoutForm.css";
import Button from "../Shared/Button/Button";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { TbFidgetSpinner } from "react-icons/tb";

const CheckoutForm = ({ closeModal, purchaseInfo, refetch, totalQuantity }) => {
  const axiosSecure = useAxiosSecure();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    getPaymentIntent();
  }, [purchaseInfo]);
  // console.log(clientSecret);
  const getPaymentIntent = async () => {
    try {
      const { data } = await axiosSecure.post("/create-payment-intent", {
        quantity: purchaseInfo?.quantity,
        plantId: purchaseInfo?.plantId,
      });
      setClientSecret(data.clientSecret);
    } catch (err) {
      console.log(err);
    }
  };

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    setLoading(true);

    try {
      // Use your card Element with other Stripe.js APIs
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card,
      });
      if (error) {
        console.log("[error]", error);
        toast.error(error.message);
        setLoading(false);
        return;
      } else {
        console.log("[PaymentMethod]", paymentMethod);
      }

      // confirm payment
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
            billing_details: {
              name: purchaseInfo?.customer?.name,
              email: purchaseInfo?.customer?.email,
            },
          },
        });

      if (confirmError) {
        console.log("[confirmError]", confirmError);
        toast.error(confirmError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        try {
          // save data in db
          await axiosSecure.post("/order", {
            ...purchaseInfo,
            trasactionId: paymentIntent?.id,
          });
          // decrease quantity from plant colection
          await axiosSecure.patch(`/plants/quantity/${purchaseInfo?.plantId}`, {
            quantityToUpdate: totalQuantity,
            status: "decrease",
          });

          toast.success("Order Successful!");
          refetch();
          navigate("/dashboard/my-orders");
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
          closeModal();
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      <div className="flex justify-around mt-2 gap-3">
        <Button
          type="submit"
          label={
            loading ? (
              <TbFidgetSpinner className="animate-spin m-auto" />
            ) : (
              `Pay ${purchaseInfo?.price}$`
            )
          }
          disabled={!stripe || !clientSecret || loading}
        />
        <Button
          outline={true}
          onClick={closeModal}
          disabled={loading}
          label={"Cancel"}
        />
      </div>
    </form>
  );
};

export default CheckoutForm;
