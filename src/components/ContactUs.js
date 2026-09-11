function ContactUs() {
  const handleContactUs = () => {
    window.location.href = "https://support.mamaearth.in/support/home";
  };

  return (
    <div>
      <button onClick={handleContactUs}>
        Contact Us
      </button>
    </div>
  );
}

export default ContactUs;