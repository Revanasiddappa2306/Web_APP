import React from 'react';

const PagesTable = ({ pages }) => (
  <div className="bg-white rounded shadow p-4 w-[40%] mr-[5%]">
    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pages</h2>
    <div className="h-64 overflow-y-auto border rounded">
      <table className="table-auto w-full text-left border">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Page ID</th>
            <th className="px-4 py-2">Page Name</th>
            <th className="px-4 py-2">Admin ID</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.PageID} className="border-t">
              <td className="px-4 py-2">{page.PageID}</td>
              <td className="px-4 py-2">{page.PageName}</td>
              <td className="px-4 py-2">{page.CreatedByAdminID}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default PagesTable;
