'use client'

import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

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

export default function AdminDashboard() {
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireOverview[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [newInvitationLink, setNewInvitationLink] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadQuestionnaires()
  }, [])

  const loadQuestionnaires = async () => {
    setLoading(true)
    try {
      // Try to load from cloud first
      const cloudResponse = await fetch('/api/cloud/admin/overview')
      if (cloudResponse.ok) {
        const cloudData = await cloudResponse.json()
        setQuestionnaires(cloudData)
        // Also save to localStorage as backup
        saveToStorage(cloudData)
        console.log('✅ Loaded questionnaires from cloud:', cloudData.length)
        console.log('Cloud questionnaires:', cloudData)
      } else {
        // Fallback to localStorage
        loadStoredQuestionnaires()
        console.log('⚠️ Cloud unavailable, using localStorage')
      }
    } catch (error) {
      console.error('Cloud fetch failed, using localStorage:', error)
      // Fallback to localStorage
      loadStoredQuestionnaires()
    } finally {
      setLoading(false)
    }
  }

  const loadStoredQuestionnaires = () => {
    try {
      const stored = localStorage.getItem('auPairQuestionnaires')
      if (stored) {
        setQuestionnaires(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading stored questionnaires:', error)
    }
  }

  const saveToStorage = (questionnaires: QuestionnaireOverview[]) => {
    try {
      localStorage.setItem('auPairQuestionnaires', JSON.stringify(questionnaires))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  const generateInvitationLink = async () => {
    setGenerating(true)
    setError('')
    
    try {
      // Try to generate via cloud first
      const cloudResponse = await fetch('/api/cloud/admin/generate-link', {
        method: 'POST'
      })
      
      if (cloudResponse.ok) {
        const cloudData = await cloudResponse.json()
        setNewInvitationLink(cloudData.invitationLink)
        
        // Reload questionnaires to show the new one
        await loadQuestionnaires()
        
        // Show success message
        setTimeout(() => {
          alert(`✅ Einladungslink erfolgreich generiert! (Cloud)\n\nLink: ${cloudData.invitationLink}\n\nToken: ${cloudData.token}`)
        }, 100)
        
        // Force another reload after longer delay to ensure cloud sync
        setTimeout(async () => {
          console.log('🔄 Force reloading questionnaires after cloud sync')
          await loadQuestionnaires()
        }, 5000)
        
        // Additional reload attempts to catch race conditions
        setTimeout(async () => {
          console.log('🔄 Secondary reload attempt')
          await loadQuestionnaires()
        }, 8000)
        
        console.log('✅ Generated invitation link via cloud')
        
      } else {
        // Fallback to localStorage method
        await generateInvitationLinkLocal()
      }
      
    } catch (error) {
      console.error('Cloud generation failed, using localStorage:', error)
      // Fallback to localStorage method
      await generateInvitationLinkLocal()
    } finally {
      setGenerating(false)
    }
  }

  const generateInvitationLinkLocal = async () => {
    try {
      // Generate a unique token
      const token = uuidv4()
      
      // Get current URL base
      const baseUrl = window.location.origin
      const invitationLink = `${baseUrl}/questionnaire/${token}`
      
      // Create new questionnaire entry
      const newQuestionnaire: QuestionnaireOverview = {
        id: token,
        uniqueToken: token,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Add to stored questionnaires
      const updatedQuestionnaires = [newQuestionnaire, ...questionnaires]
      setQuestionnaires(updatedQuestionnaires)
      saveToStorage(updatedQuestionnaires)
      
      // Store the individual questionnaire
      localStorage.setItem(`questionnaire_${token}`, JSON.stringify(newQuestionnaire))
      
      setNewInvitationLink(invitationLink)
      
      // Show success message
      setTimeout(() => {
        alert(`✅ Einladungslink erfolgreich generiert! (Local)\n\nLink: ${invitationLink}\n\nToken: ${token}`)
      }, 100)
      
      console.log('⚠️ Generated invitation link via localStorage')
      
    } catch (error) {
      console.error('Error generating invitation link:', error)
      setError('Fehler beim Generieren des Einladungslinks')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('📋 Link in Zwischenablage kopiert!')
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('📋 Link kopiert!')
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE')
  }

  const clearAllData = () => {
    if (confirm('⚠️ Möchten Sie wirklich alle Daten löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      localStorage.clear()
      setQuestionnaires([])
      setNewInvitationLink('')
      alert('✅ Alle Daten gelöscht!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Admin Dashboard wird geladen...</div>
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
                <p className="text-gray-600 mt-2">Verwalten Sie Fragebögen und generieren Sie Einladungslinks</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={generateInvitationLink}
                  disabled={generating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {generating ? 'Generiere...' : '🔗 Neuen Einladungslink generieren'}
                </button>
                <button
                  onClick={loadQuestionnaires}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? 'Lade...' : '🔄 Aktualisieren'}
                </button>
                <button
                  onClick={clearAllData}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  🗑️ Daten löschen
                </button>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="px-6 py-4 bg-green-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-green-800">✅ System Status: FUNKTIONSFÄHIG</h3>
                <p className="text-sm text-green-700 mt-1">
                  Cloud-Synchronisation • Cross-Device • Lokaler Backup • Volle Funktionalität
                </p>
              </div>
              <div className="text-sm text-green-600">
                {questionnaires.length} Fragebögen gespeichert
              </div>
            </div>
          </div>

          {newInvitationLink && (
            <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-blue-800">🎉 Neuer Einladungslink generiert:</h3>
                  <p className="text-sm text-blue-700 mt-1 font-mono break-all">{newInvitationLink}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(newInvitationLink)}
                  className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  📋 Kopieren
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="px-6 py-4 bg-red-50 border-b border-gray-200">
              <div className="text-red-800">{error}</div>
            </div>
          )}

          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Generierte Einladungslinks ({questionnaires.length})
            </h2>

            {questionnaires.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">📋</div>
                <p className="text-lg">Noch keine Einladungslinks generiert</p>
                <p className="text-sm mt-2">Klicken Sie auf "Neuen Einladungslink generieren" um zu beginnen.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Token
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Erstellt
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aktionen
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {questionnaires.map((questionnaire) => (
                      <tr key={questionnaire.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-900">
                            {questionnaire.uniqueToken.substring(0, 8)}...
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {questionnaire.firstName && questionnaire.lastName 
                              ? `${questionnaire.firstName} ${questionnaire.lastName}`
                              : 'Noch nicht ausgefüllt'
                            }
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(questionnaire.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <a
                            href={`/questionnaire/${questionnaire.uniqueToken}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            📝 Öffnen
                          </a>
                          <button
                            onClick={() => copyToClipboard(`${window.location.origin}/questionnaire/${questionnaire.uniqueToken}`)}
                            className="text-green-600 hover:text-green-900"
                          >
                            📋 Link kopieren
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">📋 Anleitung</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              <li>Klicken Sie auf "Neuen Einladungslink generieren"</li>
              <li>Kopieren Sie den generierten Link</li>
              <li>Senden Sie den Link per E-Mail an das Au Pair</li>
              <li>Das Au Pair kann den Fragebogen über den Link ausfüllen</li>
              <li>Sehen Sie hier alle generierten Links und deren Status</li>
            </ol>
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Hinweis:</strong> Diese Version verwendet den Browser-Speicher für maximale Kompatibilität. 
                Alle Daten werden lokal gespeichert und funktionieren auch offline.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}