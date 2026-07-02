import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllUserUrls } from "../api/user.api.js";
import { queryClient } from "../main.jsx";
import {deleteShortUrl,updateShortUrl,} from "../api/shortUrl.api.js";

const BASE_URL = "http://localhost:3000";

const UserUrl = () => {

  const { data: urls, isLoading, isError, error } = useQuery({
    queryKey: ["userUrls"],
    queryFn: getAllUserUrls,
    refetchInterval: 30000,
    staleTime: 0,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteShortUrl,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userUrls"],
        exact:true,
      });
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, slug }) =>
        updateShortUrl(id, slug),
  
    onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: ["userUrls"],
        });
      
        setEditingId(null);
        setEditedSlug("");
    },
  });

  const [copiedId, setCopiedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedSlug, setEditedSlug] = useState("");

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);

    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this URL?"
    );

    if (!confirmDelete) return;

    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        Error loading your URLs: {error.message}
      </div>
    );
  }

  if (!urls?.urls || urls.urls.length === 0) {
    return (
      <div className="text-center text-gray-500 my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <svg
          className="w-12 h-12 mx-auto text-gray-400 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>

        <p className="text-lg font-medium">No URLs found</p>

        <p className="mt-1">
          You haven't created any shortened URLs yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg mt-5 shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Original URL
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Short URL
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clicks
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {[...urls.urls].reverse().map((url) => (
              <tr key={url._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 truncate max-w-xs">
                    {url.full_url}
                  </div>
                </td>

                <td className="px-6 py-4">
                  {editingId === url._id ? (
                    <input
                      type="text"
                      value={editedSlug}
                      onChange={(e) => setEditedSlug(e.target.value)}
                      className="border rounded px-2 py-1 text-sm w-40"
                    />
                  ) : (
                    <a
                      href={`${BASE_URL}/${url.short_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900 hover:underline"
                    >
                      {`${BASE_URL.replace("http://", "")}/${url.short_url}`}
                    </a>
                  )}
                </td>

                <td className="px-6 py-4">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {url.clicks} {url.clicks === 1 ? "click" : "clicks"}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleCopy(`${BASE_URL}/${url.short_url}`, url._id)
                      }
                      className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium ${
                        copiedId === url._id
                          ? "bg-green-600 text-white"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {copiedId === url._id ? "Copied!" : "Copy"}
                    </button>                   
                    {editingId === url._id ? (
                      <>
                        <button
                          onClick={() =>
                            updateMutation.mutate({
                              id: url._id,
                              slug: editedSlug,
                            })
                          }
                          disabled={updateMutation.isPending}
                          className="px-3 py-1.5 rounded-md text-xs font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          {updateMutation.isPending ? "Saving..." : "Save"}
                        </button>                  
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditedSlug("");
                          }}
                          className="px-3 py-1.5 rounded-md text-xs font-medium bg-gray-500 text-white hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(url._id);
                            setEditedSlug(url.short_url);
                          }}
                          className="px-3 py-1.5 rounded-md text-xs font-medium bg-yellow-500 text-white hover:bg-yellow-600"
                        >
                          Edit
                        </button>                   
                        <button
                          onClick={() => handleDelete(url._id)}
                          disabled={deleteMutation.isPending}
                          className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserUrl;