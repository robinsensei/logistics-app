package com.Logistics.LogisticsBackend.security.services;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.Logistics.LogisticsBackend.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;

@Getter
public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String employeeId;
    private String username;
    private String email;

    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;

    // Employee fields
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    private Date dateOfBirth;
    private Date joiningDate;
    private String emergencyContact;
    private User.EmployeeStatus status;

    public UserDetailsImpl(Long id, String username, String email, String password,
            Collection<? extends GrantedAuthority> authorities, String employeeId, String firstName, String lastName, String phone,
            String address, Date dateOfBirth, Date joiningDate, String emergencyContact, User.EmployeeStatus status) {
        this.id = id;
        this.username = username;
        this.employeeId = employeeId;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.address = address;
        this.dateOfBirth = dateOfBirth;
        this.joiningDate = joiningDate;
        this.emergencyContact = emergencyContact;
        this.status = status;
    }

    public static UserDetailsImpl build(User user) {
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name())).collect(Collectors.toList());

        return new UserDetailsImpl(
                user.getId(), 
                user.getUsername(), 
                user.getEmail(), 
                user.getPassword(), 
                authorities,
                user.getEmployeeId(),
                user.getFirstName(), // Ensure this is being passed
                user.getLastName(),  // Ensure this is being passed
                user.getPhone(), user.getAddress(), user.getDateOfBirth(),
                user.getJoiningDate(), user.getEmergencyContact(), user.getStatus());
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String getPassword() {
        return password;
    }
}