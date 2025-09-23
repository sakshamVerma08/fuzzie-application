import React from 'react'

type Props = {}

const Loader = (props: Props) => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
    </div>
  );
}

export default Loader;