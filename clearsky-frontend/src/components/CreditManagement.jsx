import React, { useState, useEffect } from 'react'
import { institutionAPI } from '../services/api'

function CreditManagement() {
  const [institutions, setInstitutions] = useState([])
  const [selectedInstitution, setSelectedInstitution] = useState('')
  const [institutionCredits, setInstitutionCredits] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  // Purchase credits form
  const [purchaseAmount, setPurchaseAmount] = useState('')
  
  // Consume credits form
  const [consumeAmount, setConsumeAmount] = useState('')

  useEffect(() => {
    loadInstitutions()
  }, [])

  const loadInstitutions = async () => {
    setLoading(true)
    try {
      const response = await institutionAPI.getAllInstitutions()
      setInstitutions(Array.isArray(response) ? response : [])
    } catch (error) {
      setMessage('Failed to load institutions: ' + error.message)
      setInstitutions([])
    } finally {
      setLoading(false)
    }
  }

  const handleInstitutionChange = async (e) => {
    const institutionId = e.target.value
    setSelectedInstitution(institutionId)
    setInstitutionCredits(null)
    
    if (institutionId) {
      await loadInstitutionCredits(institutionId)
    }
  }

  const loadInstitutionCredits = async (institutionId) => {
    setLoading(true)
    setMessage('')
    
    try {
      const response = await institutionAPI.getCredits(institutionId)
      setInstitutionCredits(response)
    } catch (error) {
      setMessage('Failed to load credits: ' + error.message)
      setInstitutionCredits(null)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchaseCredits = async (e) => {
    e.preventDefault()
    if (!selectedInstitution || !purchaseAmount) return
    
    setLoading(true)
    setMessage('')
    
    try {
      const amount = parseInt(purchaseAmount)
      if (amount <= 0) {
        throw new Error('Amount must be greater than 0')
      }
      
      const response = await institutionAPI.purchaseCredits(selectedInstitution, amount)
      
      if (response.success) {
        setMessage(`Successfully purchased ${amount} credits!`)
        setPurchaseAmount('')
        await loadInstitutionCredits(selectedInstitution)
      }
    } catch (error) {
      setMessage('Failed to purchase credits: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleConsumeCredits = async (e) => {
    e.preventDefault()
    if (!selectedInstitution || !consumeAmount) return
    
    setLoading(true)
    setMessage('')
    
    try {
      const amount = parseInt(consumeAmount)
      if (amount <= 0) {
        throw new Error('Amount must be greater than 0')
      }
      
      const response = await institutionAPI.consumeCredits(selectedInstitution, amount)
      
      if (response.success) {
        setMessage(`Successfully consumed ${amount} credits!`)
        setConsumeAmount('')
        await loadInstitutionCredits(selectedInstitution)
      }
    } catch (error) {
      setMessage('Failed to consume credits: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const selectedInstitutionData = institutions.find(inst => inst.id === parseInt(selectedInstitution))

  return (
    <div className="credit-management">
      <h1>Credit Management</h1>
      
      {message && (
        <div className={`message ${message.includes('Successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="institution-selector">
        <label htmlFor="institution">Select Institution:</label>
        <select
          id="institution"
          value={selectedInstitution}
          onChange={handleInstitutionChange}
          disabled={loading}
        >
          <option value="">Choose an institution...</option>
          {institutions.map((institution) => (
            <option key={institution.id} value={institution.id}>
              {institution.name}
            </option>
          ))}
        </select>
      </div>

      {selectedInstitution && (
        <div className="credit-info">
          <div className="current-credits">
            <h2>Current Credits</h2>
            {loading ? (
              <div className="loading">Loading credits...</div>
            ) : institutionCredits ? (
              <div className="credits-display">
                <div className="credit-amount">
                  {institutionCredits.tokens || 0}
                </div>
                <div className="credit-label">Available Credits</div>
              </div>
            ) : (
              <div className="no-data">Unable to load credit information</div>
            )}
          </div>

          <div className="credit-actions">
            <div className="action-section">
              <h3>Purchase Credits</h3>
              <form onSubmit={handlePurchaseCredits} className="credit-form">
                <div className="form-group">
                  <label htmlFor="purchaseAmount">Amount to Purchase:</label>
                  <input
                    type="number"
                    id="purchaseAmount"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    min="1"
                    required
                    disabled={loading}
                    placeholder="Enter amount"
                  />
                </div>
                <button type="submit" disabled={loading} className="btn btn-success">
                  {loading ? 'Processing...' : 'Purchase Credits'}
                </button>
              </form>
            </div>

            <div className="action-section">
              <h3>Consume Credits</h3>
              <form onSubmit={handleConsumeCredits} className="credit-form">
                <div className="form-group">
                  <label htmlFor="consumeAmount">Amount to Consume:</label>
                  <input
                    type="number"
                    id="consumeAmount"
                    value={consumeAmount}
                    onChange={(e) => setConsumeAmount(e.target.value)}
                    min="1"
                    max={institutionCredits?.tokens || 0}
                    required
                    disabled={loading}
                    placeholder="Enter amount"
                  />
                </div>
                <button type="submit" disabled={loading} className="btn btn-warning">
                  {loading ? 'Processing...' : 'Consume Credits'}
                </button>
              </form>
            </div>
          </div>

          {selectedInstitutionData && (
            <div className="institution-details">
              <h3>Institution Details</h3>
              <div className="details-card">
                <p><strong>Name:</strong> {selectedInstitutionData.name}</p>
                <p><strong>ID:</strong> {selectedInstitutionData.id}</p>
                <p><strong>Total Credits:</strong> {selectedInstitutionData.tokens || 0}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .credit-management {
          max-width: 800px;
          margin: 2rem auto;
          padding: 2rem;
        }

        .institution-selector {
          margin-bottom: 2rem;
        }

        .institution-selector label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .institution-selector select {
          width: 100%;
          max-width: 400px;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        .credit-info {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .current-credits {
          background: #f8f9fa;
          padding: 2rem;
          text-align: center;
        }

        .current-credits h2 {
          margin: 0 0 1rem 0;
          color: #333;
        }

        .credits-display {
          display: inline-block;
        }

        .credit-amount {
          font-size: 3rem;
          font-weight: bold;
          color: #007bff;
          margin-bottom: 0.5rem;
        }

        .credit-label {
          font-size: 1.1rem;
          color: #666;
        }

        .credit-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          padding: 2rem;
        }

        .action-section h3 {
          margin: 0 0 1rem 0;
          color: #333;
        }

        .credit-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          font-size: 1rem;
          transition: background-color 0.2s;
        }

        .btn-success {
          background: #28a745;
          color: white;
        }

        .btn-success:hover:not(:disabled) {
          background: #218838;
        }

        .btn-warning {
          background: #ffc107;
          color: #212529;
        }

        .btn-warning:hover:not(:disabled) {
          background: #e0a800;
        }

        .btn:disabled {
          background: #6c757d;
          color: white;
          cursor: not-allowed;
        }

        .institution-details {
          border-top: 1px solid #ddd;
          padding: 2rem;
          background: #f8f9fa;
        }

        .institution-details h3 {
          margin: 0 0 1rem 0;
          color: #333;
        }

        .details-card {
          background: white;
          padding: 1rem;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        .details-card p {
          margin: 0.5rem 0;
        }

        .message {
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 4px;
          font-weight: 500;
        }

        .message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .loading {
          text-align: center;
          color: #666;
          padding: 1rem;
        }

        .no-data {
          text-align: center;
          color: #666;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .credit-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default CreditManagement