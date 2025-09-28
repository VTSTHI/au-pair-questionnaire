'use client'

import { useState, useEffect } from 'react'

interface QuestionnaireOverview {
  id: string
  uniqueToken: string
  firstName?: string
  lastName?: string
  age?: number
  country?: string
  nationality?: string
  createdAt: string
  updatedAt: string
}

interface AuditLog {
  id: string
  fieldName: string
  oldValue?: string
  newValue?: string
  changedAt: string
}

export default function AdminDashboard() {
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireOverview[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [newInvitationLink, setNewInvitationLink] = useState('')
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<string | null>(null)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])

  useEffect(() => {
    fetchQuestionnaires()
  }, [])

  const fetchQuestionnaires = async () => {
    try {
      const response = await fetch('/api/admin/overview')
      if (response.ok) {
        const data = await response.json()
        setQuestionnaires(data)
      }
    } catch (error) {
      console.error('Failed to fetch questionnaires:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateInvitationLink = async () => {
    setGenerating(true)
    try {
      const response = await fetch('/api/admin/generate-link', {
        method: 'POST',
      })
      if (response.ok) {
        const data = await response.json()
        setNewInvitationLink(data.invitationLink)
        fetchQuestionnaires() // Refresh the list
      }
    } catch (error) {
      console.error('Failed to generate invitation link:', error)
    } finally {
      setGenerating(false)
    }
  }

  const viewAuditLogs = async (questionnaireId: string) => {
    try {
      const response = await fetch(`/api/admin/audit-logs/${questionnaireId}`)
      if (response.ok) {
        const logs = await response.json()
        setAuditLogs(logs)
        setSelectedQuestionnaire(questionnaireId)
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading admin dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Au Pair Admin Dashboard</h1>
                <p className="text-gray-600 mt-2">Manage questionnaires and generate invitation links</p>
              </div>
              <button
                onClick={generateInvitationLink}
                disabled={generating}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {generating ? 'Generating...' : 'Generate New Invitation Link'}
              </button>
            </div>
          </div>

          {newInvitationLink && (
            <div className="px-6 py-4 bg-green-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-green-800">New Invitation Link Generated:</h3>
                  <p className="text-sm text-green-700 mt-1 font-mono">{newInvitationLink}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(newInvitationLink)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Copy Link
                </button>
              </div>
            </div>
          )}

          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Submitted Questionnaires ({questionnaires.length})
            </h2>

            {questionnaires.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No questionnaires submitted yet. Generate an invitation link to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Country
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nationality
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {questionnaires.map((questionnaire) => (
                      <tr key={questionnaire.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {questionnaire.firstName || 'N/A'} {questionnaire.lastName || ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {questionnaire.age || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {questionnaire.country || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {questionnaire.nationality || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(questionnaire.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(questionnaire.updatedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <a
                            href={`/questionnaire/${questionnaire.uniqueToken}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </a>
                          <button
                            onClick={() => viewAuditLogs(questionnaire.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Audit Logs
                          </button>
                          <button
                            onClick={() => copyToClipboard(`${window.location.origin}/questionnaire/${questionnaire.uniqueToken}`)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Copy Link
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Audit Logs Modal */}
        {selectedQuestionnaire && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-96 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Audit Logs</h3>
                <button
                  onClick={() => setSelectedQuestionnaire(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-80">
                {auditLogs.length === 0 ? (
                  <p className="text-gray-500">No changes recorded yet.</p>
                ) : (
                  <div className="space-y-4">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{log.fieldName}</h4>
                            <div className="mt-2 space-y-1">
                              <div>
                                <span className="text-sm text-gray-500">From: </span>
                                <span className="text-sm text-red-600">
                                  {log.oldValue || '(empty)'}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-500">To: </span>
                                <span className="text-sm text-green-600">
                                  {log.newValue || '(empty)'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 ml-4">
                            {formatDate(log.changedAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}