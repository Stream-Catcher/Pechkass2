import React from 'react';

export const MicIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14a2 2 0 0 1-2-2V6a2 2 0 0 1 4 0v6a2 2 0 0 1-2 2zm-2.293-1.293a1 1 0 0 1 1.414 0L12 13.414l.879-.879a1 1 0 1 1 1.414 1.414L13.414 14l.879.879a1 1 0 0 1-1.414 1.414L12 15.414l-.879.879a1 1 0 0 1-1.414-1.414L10.586 14l-.879-.879a1 1 0 0 1 0-1.414zM12 1a5 5 0 0 0-5 5v6a5 5 0 0 0 10 0V6a5 5 0 0 0-5-5zM5 12H4a1 1 0 0 0-1 1v1a8 8 0 0 0 8 8v3h-2a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-3a8 8 0 0 0 8-8v-1a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v1a6 6 0 0 1-12 0v-1a1 1 0 0 0-1-1z"/>
  </svg>
);

export const StopIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm-2 4v8h8v-8H8z"/>
  </svg>
);

export const UploadIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);