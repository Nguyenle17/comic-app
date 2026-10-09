package com.ncomics.backend.modules.auth.security;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey key;
    private final long accessTokenMs;
    private final long refreshTokenMs;

    public JwtService(@Value("${jwt.secret-key}") String secret,
                      @Value("${jwt.access-token-ms}") long accessTokenMs,
                      @Value("${jwt.refresh-token-ms}") long refreshTokenMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenMs = accessTokenMs;
        this.refreshTokenMs = refreshTokenMs;
    }

    public String generateAccessToken(UserDetails userDetails) {
        return generateToken(Map.of("type", "access"), userDetails, accessTokenMs);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return generateToken(Map.of("type", "refresh"), userDetails, refreshTokenMs);
    }

    private String generateToken(Map<String, Object> extraClaims,
                                 UserDetails userDetails,
                                 long expirationMs) {
        Date now = new Date();
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(key)
                .compact();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        return isTokenValid(token, userDetails, "access");
    }

    public boolean isRefreshTokenValid(
            String token,
            UserDetails userDetails
    ) {
        return isTokenValid(token, userDetails, "refresh");
    }

    private boolean isTokenValid(
            String token,
            UserDetails userDetails,
            String expectedType
    ) {
        Claims claims = extractAllClaims(token);
        return expectedType.equals(claims.get("type", String.class))
                && claims.getSubject().equals(userDetails.getUsername())
                && claims.getExpiration().after(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
