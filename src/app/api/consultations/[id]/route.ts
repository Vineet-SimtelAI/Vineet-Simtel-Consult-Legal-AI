import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_URL || 'http://localhost:4000/api/v1';

function getAuthHeader(request: NextRequest) {
  return request.headers.get('Authorization') || '';
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const response = await fetch(`${API_BASE}/consultations/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthHeader(request),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Determine action based on body
    let endpoint = `${API_BASE}/consultations/${id}`;
    if (body.action === 'cancel') {
      endpoint = `${API_BASE}/consultations/${id}/cancel`;
    } else if (body.action === 'review') {
      endpoint = `${API_BASE}/consultations/${id}/review`;
    }

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthHeader(request),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 },
    );
  }
}
