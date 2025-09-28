import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Au Pair Questionnaire System
            </h1>
            <p className="text-gray-600 mb-8">
              A comprehensive system for managing au pair applications and questionnaires.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h2 className="text-xl font-semibold text-blue-900 mb-3">
                  Admin Dashboard
                </h2>
                <p className="text-blue-700 mb-4">
                  View submitted questionnaires, generate invitation links, and manage audit logs.
                </p>
                <Link
                  href="/admin"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Access Admin Panel
                </Link>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h2 className="text-xl font-semibold text-green-900 mb-3">
                  Au Pair Portal
                </h2>
                <p className="text-green-700 mb-4">
                  Complete your questionnaire using the unique invitation link provided to you.
                </p>
                <div className="text-sm text-green-600">
                  Use your invitation link to access the questionnaire
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white shadow-lg rounded-lg">
          <div className="px-6 py-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Comprehensive Forms</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Detailed questionnaire covering all aspects of au pair applications
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Real-time Saving</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Auto-save functionality and change tracking with audit logs
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Secure Access</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Unique invitation links for secure questionnaire access
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
