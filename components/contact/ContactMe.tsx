"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "../ui/button";
import { InputField } from "../input/InputField";

type FormData = {
  name: string;
  email: string;
  message: string;
};

const ContactMe = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Generic handler for input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return (
    <div>
      <div className="p-4 text-center border-t">
        <h2 className="text-4xl pt-6 font-bold mb-6">Let's Work Together</h2>
        <p className="text-lg text-foreground/70 mb-8">
          I'm always open to discussing new projects, creative ideas, or
          opportunities to be part of your vision.
        </p>
        {success ? (
          <p className="text-green-600 text-center">
            ✅ Message sent successfully! Check your email.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto space-y-6 border border-border p-6 rounded-lg"
          >
            <InputField
              field="input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Input your name"
              label="Name"
              className="bg-accent"
            />

            <InputField
              field="input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Input your email"
              label="Email"
            />

            <InputField
              field="textarea"
              type="text"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message"
              label="Message"
            />

            <Button type="submit" className="w-full btn-primary text-lg py-6">
              {loading ? "sending.." : "Send Message"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactMe;
