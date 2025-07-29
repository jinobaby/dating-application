import React, { useState } from 'react';
import StepLocationPermission from './steps/StepLocationPermission';
import StepNotificationPermission from './steps/StepNotificationPermission';
import ImageShuffle from '../components/ImageShuffle';

const steps = [
  StepLocationPermission,
  StepNotificationPermission
];

const AccountCreation = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});

  const StepComponent = steps[step];

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const updateData = (data) => setFormData((prev) => ({ ...prev, ...data }));

  return (
    <div className="membership-body">
        <ImageShuffle />
      <div className="form-container">
        <div style={{ margin: "24px 0" }}>
          <ProgressBar step={step} steps={steps.length} />
        </div>
        <StepComponent
          data={formData}
          updateData={updateData}
          next={next}
          back={back}
          isLast={step === steps.length - 1}
          isFirst={step === 0}
        />
      </div>
    </div>
  );
};

const ProgressBar = ({ step, steps }) => (
  <div style={{ display: "flex", gap: 12 }}>
    {[...Array(steps)].map((_, i) => (
      <div
        key={i}
        style={{
          width: 32,
          height: 8,
          borderRadius: 8,
          background: i <= step ? "#8c2022" : "#bbb",
          transition: "background 0.3s"
        }}
      />
    ))}
  </div>
);

export default AccountCreation;