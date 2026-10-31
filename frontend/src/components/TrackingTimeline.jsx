import React from 'react';
import { CheckCircle2, Clock, Truck, Heart, AlertTriangle, ShieldCheck } from 'lucide-react';

const STEPS = [
  { key: 'Available', label: '1. Available', icon: ShieldCheck, desc: 'Donation listed' },
  { key: 'Requested', label: '2. Requested', icon: Clock, desc: 'NGO request placed' },
  { key: 'Accepted', label: '3. Accepted', icon: Heart, desc: 'Matched & OTP issued' },
  { key: 'Picked Up', label: '4. In Transit', icon: Truck, desc: 'Volunteer collected' },
  { key: 'Delivered', label: '5. Delivered', icon: CheckCircle2, desc: 'Meals served' },
];

const TrackingTimeline = ({ currentStatus, trackingLogs = [], verificationOtp = null }) => {
  const isCancelled = currentStatus === 'Cancelled';

  // Determine current active step index
  const getStepIndex = (status) => {
    switch (status) {
      case 'Available':
        return 0;
      case 'Requested':
        return 1;
      case 'Accepted':
        return 2;
      case 'Picked Up':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Donation Lifecycle Journey</span>
            {isCancelled && (
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
                Cancelled
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time auditable tracking from kitchen prep to distribution
          </p>
        </div>

        {verificationOtp && currentStatus === 'Accepted' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-right">
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
              Pickup Verification PIN
            </span>
            <span className="text-xl font-mono font-extrabold text-amber-900 tracking-widest">
              {verificationOtp}
            </span>
          </div>
        )}
      </div>

      {/* Progress Stepper Bar */}
      {!isCancelled ? (
        <div className="relative mb-10 px-2 sm:px-6">
          <div className="hidden sm:block absolute top-1/2 left-8 right-8 h-1 bg-slate-200 -translate-y-1/2 z-0" />
          <div
            className="hidden sm:block absolute top-1/2 left-8 h-1 bg-brand-500 -translate-y-1/2 z-0 transition-all duration-500"
            style={{
              width: `${(currentIndex / (STEPS.length - 1)) * 85}%`,
            }}
          />

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative z-10">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isDone = idx < currentIndex;
              const isCurrent = idx === currentIndex;

              return (
                <div key={step.key} className="flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 shadow-sm ${
                      isDone
                        ? 'bg-brand-600 text-white shadow-brand-500/20'
                        : isCurrent
                        ? 'bg-brand-500 text-white ring-4 ring-brand-100 shadow-brand-500/30'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs font-semibold mt-2 ${
                      isCurrent
                        ? 'text-brand-700 font-bold'
                        : isDone
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:block">
                    {step.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800 text-sm">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-semibold">This donation was cancelled</p>
            <p className="text-xs text-red-600">The listings and requests have been closed.</p>
          </div>
        </div>
      )}

      {/* Activity Logs Timeline */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Activity Log & Updates ({trackingLogs.length})
        </h4>

        {trackingLogs.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No activity recorded yet.</p>
        ) : (
          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {trackingLogs.map((log, idx) => (
              <div key={log._id || idx} className="relative group">
                <div className="absolute -left-[1.8rem] top-1 w-3.5 h-3.5 rounded-full bg-brand-500 border-2 border-white shadow-sm ring-2 ring-slate-100" />
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800">{log.title}</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {log.note && <p className="text-slate-600 mt-1">{log.note}</p>}
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] font-medium text-slate-400">By:</span>
                    <span className="text-[10px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {log.updatedBy?.organizationName || log.updatedBy?.name || 'FoodBridge System'}
                    </span>
                    <span className="text-[10px] text-brand-600 font-medium uppercase">
                      ({log.actorRole || 'system'})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingTimeline;
