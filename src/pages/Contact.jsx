import React from 'react'

const Contact = () => {
  return (
    <div id='contact'>
      <section className="contact-form">
        <div className="container">
          <h2>Send Us a Message</h2>
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <input type="text" placeholder="Subject" />
            <textarea rows="5" placeholder="Your Message" required></textarea>
            <button type="submit">Submit</button>
          </form>

          <div className="contact-details">
            <h3>To Place an Order</h3>
            <p>Please contact us via email or reach out through phone.</p>
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <a href="mailto:kugi.hands2025@gmail.com">kugi.hands2025@gmail.com</a>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <a href="tel:+63946807383">+63 946 807 383</a>
            </div>
          </div>
        </div>
      </section>

    <footer>
        <p>&copy; 2025 KugiHands. All rights reserved.</p>
    </footer>
    </div>
  )
}

export default Contact