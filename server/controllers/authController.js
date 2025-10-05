import { supabase } from '../config/supabase.js';

export const signup = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ 
        error: 'Email, password, and full name are required' 
      });
    }

    console.log(`🔐 Creating account for: ${email}`);

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for development
      user_metadata: {
        full_name: fullName
      }
    });

    if (authError) {
      console.error('❌ Auth creation error:', authError);
      return res.status(400).json({ 
        error: authError.message || 'Failed to create account' 
      });
    }

    if (!authData.user) {
      return res.status(400).json({ 
        error: 'Failed to create user account' 
      });
    }

    // Create profile in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email,
        full_name: fullName
      });

    if (profileError) {
      console.error('❌ Profile creation error:', profileError);
      // Don't fail the request if profile creation fails
    }

    console.log(`✅ Account created successfully for: ${email}`);

    res.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name: fullName
      }
    });

  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ 
      error: 'Internal server error during signup' 
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    console.log(`🔐 Sign in attempt for: ${email}`);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('❌ Sign in error:', error);
      return res.status(400).json({ 
        error: error.message || 'Invalid credentials' 
      });
    }

    console.log(`✅ Sign in successful for: ${email}`);

    res.json({
      success: true,
      message: 'Signed in successfully',
      user: data.user,
      session: data.session
    });

  } catch (error) {
    console.error('❌ Signin error:', error);
    res.status(500).json({ 
      error: 'Internal server error during signin' 
    });
  }
};

export const signout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('❌ Sign out error:', error);
      return res.status(400).json({ 
        error: error.message || 'Failed to sign out' 
      });
    }

    console.log('✅ User signed out successfully');

    res.json({
      success: true,
      message: 'Signed out successfully'
    });

  } catch (error) {
    console.error('❌ Signout error:', error);
    res.status(500).json({ 
      error: 'Internal server error during signout' 
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('❌ Profile fetch error:', error);
      return res.status(404).json({ 
        error: 'Profile not found' 
      });
    }

    res.json({
      success: true,
      profile
    });

  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};