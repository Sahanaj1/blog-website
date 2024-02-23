import React from 'react';
import { Link } from 'react-router-dom';
import Feed from '../components/Feed';

function Homepage() {
  return (
    <div className="w-full p-4 h-auto min-h-[90vh]">
      <div className=" p-4 rounded">
        <h2 className="text-2xl font-semibold mb-4">Feed posts</h2>
        <div className='flex items-center justify-center w-full'>
        <Feed/>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
