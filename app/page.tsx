"use client";

import { useState, useRef, useEffect } from "react";

function Page() {
  const refd = useRef(null);
  const [visible, setVisible] = useState(false);
  const [certificate, setCertificate] = useState('');
  const [certificateSrc, setCertificateSrc] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    console.log('submitting');
    setVisible(true);
    setCertificate(refd.current?.value);
    setError(null); // Reset error state on new submission
  }

  useEffect(() => {
    if (certificate) {
      const fetchCertificate = async () => {
        try {
          const response = await fetch(`/api/certificate/${certificate}`, {
            // Disable cache by adding a random query parameter
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
            }});

          if (!response.ok) {
            throw new Error("Certificate not found");
          }
          const record = await response.json();
          setCertificateSrc(
            `https://drive.google.com/file/d/${record.certificate.url}/preview`
          );
        } catch (error) {
          console.error("Error fetching certificate:", error);
          setCertificateSrc(undefined);
          setError("Certificate not found");
        }
      };

      fetchCertificate();
    }
  }, [certificate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">The Swotters</h1>

      <h1 className="text-xl font-bold mb-8">Certificate Verification</h1>
      <div className="flex flex-row items-center mb-6 gap-2">
        <input
          type="text"
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md"
          ref={refd}
          placeholder="Certificate ID"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
        >
          Check
        </button>
      </div>
      {visible && (
        <div className="w-full max-w-4xl h-96 border-2 border-gray-300 shadow-lg flex items-center justify-center">
          {certificateSrc ? (
            <iframe
              src={certificateSrc}
              className="w-full h-full"
              allow="autoplay"
            ></iframe>
          ) : (
            <p className="text-center text-gray-500">{error ? error : "Loading..."}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Page;
