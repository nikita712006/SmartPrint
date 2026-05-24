const steps = [
  {
    title: "Upload & Configure",
    description:
      "Upload your PDF and customize print settings — pages, color, binding, copies.",
  },
  {
    title: "Choose Your Shop",
    description:
      "Compare nearby print shops, prices, and pick the least crowded one.",
  },
  {
    title: "Book Time Slot",
    description:
      "Reserve a pickup time. Your prints are ready when you arrive.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <h2 className="text-4xl font-bold text-center text-gray-900">
        How PrintFlow Works
      </h2>

      <p className="text-center text-gray-600 mt-4">
        A smarter way to handle campus printing — no queues, no stress.
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-100 text-orange-500 font-bold text-lg mb-4">
              {index + 1}
            </div>

            <h3 className="text-xl font-semibold text-gray-900">
              {step.title}
            </h3>

            <p className="text-gray-600 mt-2">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
