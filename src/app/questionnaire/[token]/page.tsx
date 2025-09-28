'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface QuestionnaireData {
  id?: string
  uniqueToken?: string
  firstName?: string
  lastName?: string
  gender?: string
  nationality?: string
  placeOfBirth?: string
  dateOfBirth?: string
  age?: number
  city?: string
  country?: string
  height?: string
  weight?: string
  fatherName?: string
  fatherJob?: string
  motherName?: string
  motherJob?: string
  numberOfSiblings?: number
  siblingDetails?: string
  livingSituation?: string
  parentalSupport?: string
  familyFriendsInGermany?: string
  travelExperience?: string
  maritalStatus?: string
  hasChildren?: boolean
  allergies?: string
  smokingStatus?: string
  medicalConditions?: string
  religion?: string
  religiousImportance?: string
  meatConsumption?: string
  fishConsumption?: string
  alcoholConsumption?: string
  dietaryRestrictions?: string
  schoolHistory?: string
  universityDetails?: string
  currentEmployment?: string
  selfDescription?: string
  organizationalSkills?: string
  punctuality?: string
  communicationStyle?: string
  socialPreferences?: string
  creativity?: string
  patience?: string
  germanProficiency?: string
  englishProficiency?: string
  otherLanguages?: string
  sports?: string
  instruments?: string
  recreationalActivities?: string
  driversLicense?: boolean
  vehicleExperience?: string
  petComfort?: string
  petOwnership?: string
  petCareWillingness?: string
  ageGroupExperience?: string
  childcareSkills?: string
  handicappedChildrenExperience?: string
  cookingAbilities?: string
  cleaningSkills?: string
  laundryManagement?: string
  gardening?: string
  groceryShopping?: string
  singleParentWillingness?: string
  cityVillagePreference?: string
  familyInteraction?: string
  embassyAppointment?: string
  earliestStartDate?: string
  plannedDuration?: string
  tripFunding?: string
  motivationalLetter?: string
  photos?: string
}

export default function QuestionnairePage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  
  const [data, setData] = useState<QuestionnaireData>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchQuestionnaire()
  }, [token])

  const fetchQuestionnaire = async () => {
    try {
      const response = await fetch(`/api/questionnaire/${token}`)
      if (response.ok) {
        const questionnaireData = await response.json()
        setData(questionnaireData)
      } else if (response.status === 404) {
        setError('Questionnaire not found. Please check your invitation link.')
      }
    } catch (error) {
      setError('Failed to load questionnaire.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/questionnaire/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSuccess('Questionnaire saved successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to save questionnaire.')
      }
    } catch (error) {
      setError('Failed to save questionnaire.')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof QuestionnaireData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading questionnaire...</div>
      </div>
    )
  }

  if (error && !data.uniqueToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Au Pair Questionnaire</h1>
            <p className="text-gray-600 mt-2">Please fill out this questionnaire completely and accurately.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Personal Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={data.firstName || ''}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={data.lastName || ''}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={data.gender || ''}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                  <input
                    type="text"
                    value={data.nationality || ''}
                    onChange={(e) => handleChange('nationality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
                  <input
                    type="text"
                    value={data.placeOfBirth || ''}
                    onChange={(e) => handleChange('placeOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={data.dateOfBirth?.split('T')[0] || ''}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    min="18"
                    max="35"
                    value={data.age || ''}
                    onChange={(e) => handleChange('age', parseInt(e.target.value) || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={data.city || ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={data.country || ''}
                    onChange={(e) => handleChange('country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                  <input
                    type="text"
                    placeholder="e.g., 165 cm"
                    value={data.height || ''}
                    onChange={(e) => handleChange('height', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                  <input
                    type="text"
                    placeholder="e.g., 60 kg"
                    value={data.weight || ''}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* Family Background */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Family Background</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={data.fatherName || ''}
                    onChange={(e) => handleChange('fatherName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Job</label>
                  <input
                    type="text"
                    value={data.fatherJob || ''}
                    onChange={(e) => handleChange('fatherJob', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    value={data.motherName || ''}
                    onChange={(e) => handleChange('motherName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Job</label>
                  <input
                    type="text"
                    value={data.motherJob || ''}
                    onChange={(e) => handleChange('motherJob', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Siblings</label>
                  <input
                    type="number"
                    min="0"
                    value={data.numberOfSiblings || ''}
                    onChange={(e) => handleChange('numberOfSiblings', parseInt(e.target.value) || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                  <select
                    value={data.maritalStatus || ''}
                    onChange={(e) => handleChange('maritalStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sibling Details</label>
                  <textarea
                    rows={3}
                    value={data.siblingDetails || ''}
                    onChange={(e) => handleChange('siblingDetails', e.target.value)}
                    placeholder="Please describe your siblings (ages, occupations, etc.)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Living Situation</label>
                  <textarea
                    rows={2}
                    value={data.livingSituation || ''}
                    onChange={(e) => handleChange('livingSituation', e.target.value)}
                    placeholder="Describe your current living situation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* Language Skills */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Language Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">German Proficiency</label>
                  <select
                    value={data.germanProficiency || ''}
                    onChange={(e) => handleChange('germanProficiency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select level</option>
                    <option value="beginner">Beginner (A1)</option>
                    <option value="elementary">Elementary (A2)</option>
                    <option value="intermediate">Intermediate (B1)</option>
                    <option value="upper-intermediate">Upper Intermediate (B2)</option>
                    <option value="advanced">Advanced (C1)</option>
                    <option value="proficient">Proficient (C2)</option>
                    <option value="native">Native</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">English Proficiency</label>
                  <select
                    value={data.englishProficiency || ''}
                    onChange={(e) => handleChange('englishProficiency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select level</option>
                    <option value="beginner">Beginner (A1)</option>
                    <option value="elementary">Elementary (A2)</option>
                    <option value="intermediate">Intermediate (B1)</option>
                    <option value="upper-intermediate">Upper Intermediate (B2)</option>
                    <option value="advanced">Advanced (C1)</option>
                    <option value="proficient">Proficient (C2)</option>
                    <option value="native">Native</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other Languages</label>
                  <textarea
                    rows={2}
                    value={data.otherLanguages || ''}
                    onChange={(e) => handleChange('otherLanguages', e.target.value)}
                    placeholder="List any other languages you speak and your proficiency level"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* Childcare Experience */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Childcare Experience</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience with Different Age Groups</label>
                  <textarea
                    rows={3}
                    value={data.ageGroupExperience || ''}
                    onChange={(e) => handleChange('ageGroupExperience', e.target.value)}
                    placeholder="Describe your experience with babies, toddlers, school-age children, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Childcare Skills</label>
                  <textarea
                    rows={3}
                    value={data.childcareSkills || ''}
                    onChange={(e) => handleChange('childcareSkills', e.target.value)}
                    placeholder="List your childcare skills, certifications, training, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* Motivational Letter */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Motivational Letter</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Why do you want to become an Au Pair? What are your expectations?
                </label>
                <textarea
                  rows={6}
                  value={data.motivationalLetter || ''}
                  onChange={(e) => handleChange('motivationalLetter', e.target.value)}
                  placeholder="Please write about your motivation, expectations, and what you hope to gain from this experience..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </section>

            {/* Submit Section */}
            <div className="border-t border-gray-200 pt-6">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  {success}
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Questionnaire'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}