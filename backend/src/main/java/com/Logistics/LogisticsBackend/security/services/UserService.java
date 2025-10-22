package com.Logistics.LogisticsBackend.security.services;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Logistics.LogisticsBackend.exception.DuplicateResourceException;
import com.Logistics.LogisticsBackend.exception.ResourceNotFoundException;
import com.Logistics.LogisticsBackend.model.ERole;
import com.Logistics.LogisticsBackend.model.Role;
import com.Logistics.LogisticsBackend.model.User;
import com.Logistics.LogisticsBackend.payload.request.SignupRequest;
import com.Logistics.LogisticsBackend.payload.request.UserUpdateRequest;
import com.Logistics.LogisticsBackend.repository.RoleRepository;
import com.Logistics.LogisticsBackend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional
    public User registerUser(SignupRequest signUpRequest) {
        // Perform validation checks
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new DuplicateResourceException("Error: Username is already taken!");
        }
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new DuplicateResourceException("Error: Email is already in use!");
        }
        if (signUpRequest.getEmployeeId() != null && userRepository.existsByEmployeeId(signUpRequest.getEmployeeId())) {
            throw new DuplicateResourceException("Error: Employee ID is already in use!");
        }

        // Create and save the user
        User user = mapToUser(signUpRequest);
        return userRepository.save(user);
    }

    /**
     * Helper method to map a SignupRequest to a User entity without saving it.
     * This centralizes the mapping logic.
     *
     * @param signUpRequest The signup request DTO.
     * @return A new User entity.
     */
    private User mapToUser(SignupRequest signUpRequest) {
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

        user.setEmployeeId(signUpRequest.getEmployeeId());
        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            Role employeeRole = roleRepository.findByName(ERole.ROLE_EMPLOYEE)
                    .orElseThrow(() -> new ResourceNotFoundException("Error: Default role EMPLOYEE not found."));
            roles.add(employeeRole);
        } else {
            strRoles.forEach(role -> {
                switch (role.toLowerCase()) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new ResourceNotFoundException("Error: Role ADMIN not found."));
                        roles.add(adminRole);
                        break;
                    case "driver":
                        Role driverRole = roleRepository.findByName(ERole.ROLE_DRIVER)
                                .orElseThrow(() -> new ResourceNotFoundException("Error: Role DRIVER not found."));
                        roles.add(driverRole);
                        break;
                    default:
                        Role employeeRole = roleRepository.findByName(ERole.ROLE_EMPLOYEE)
                                .orElseThrow(() -> new ResourceNotFoundException("Error: Role EMPLOYEE not found."));
                        roles.add(employeeRole);
                }
            });
        }

        user.setRoles(roles);
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());
        user.setPhone(signUpRequest.getPhone());
        user.setAddress(signUpRequest.getAddress());
        user.setDateOfBirth(signUpRequest.getDateOfBirth());
        user.setJoiningDate(signUpRequest.getJoiningDate());
        user.setEmergencyContact(signUpRequest.getEmergencyContact());
        user.setStatus(User.EmployeeStatus.valueOf(signUpRequest.getStatus().toUpperCase()));
        return user;
    }

    @Transactional
    public List<User> registerUsersBulk(List<SignupRequest> signUpRequests) {
        // Pre-validate all requests to avoid partial updates
        for (SignupRequest request : signUpRequests) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new DuplicateResourceException("Error: Username '" + request.getUsername() + "' is already taken!");
            }
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new DuplicateResourceException("Error: Email '" + request.getEmail() + "' is already in use!");
            }
            if (request.getEmployeeId() != null && userRepository.existsByEmployeeId(request.getEmployeeId())) {
                throw new DuplicateResourceException("Error: Employee ID '" + request.getEmployeeId() + "' is already in use!");
            }
        }

        // Process all requests
        return signUpRequests.stream()
                .map(this::mapToUser) // Use the new mapping method
                .collect(Collectors.toList());
    }

    @Transactional
    public User updateUser(Long id, UserUpdateRequest userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Check if email is being changed and if it's already in use
        if (!user.getEmail().equals(userDetails.getEmail()) && userRepository.existsByEmail(userDetails.getEmail())) {
            throw new DuplicateResourceException("Error: Email is already in use!");
        }

        // Check if username is being changed and if it's already in use
        if (!user.getUsername().equals(userDetails.getUsername()) && userRepository.existsByUsername(userDetails.getUsername())) {
            throw new DuplicateResourceException("Error: Username is already in use!");
        }

        // Update user fields
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setPhone(userDetails.getPhone());
        user.setAddress(userDetails.getAddress());
        user.setDateOfBirth(userDetails.getDateOfBirth());
        user.setJoiningDate(userDetails.getJoiningDate());
        user.setEmergencyContact(userDetails.getEmergencyContact());

        if (userDetails.getStatus() != null) {
            user.setStatus(User.EmployeeStatus.valueOf(userDetails.getStatus().toUpperCase()));
        }

        if (userDetails.getRole() != null && !userDetails.getRole().isEmpty()) {
            Set<Role> roles = new HashSet<>();
            userDetails.getRole().forEach(role -> {
                switch (role.toLowerCase()) {
                    case "admin":
                        roles.add(roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new ResourceNotFoundException("Role not found")));
                        break;
                    case "driver":
                        roles.add(roleRepository.findByName(ERole.ROLE_DRIVER)
                                .orElseThrow(() -> new ResourceNotFoundException("Role not found")));
                        break;
                    default:
                        roles.add(roleRepository.findByName(ERole.ROLE_EMPLOYEE)
                                .orElseThrow(() -> new ResourceNotFoundException("Role not found")));
                }
            });
            user.setRoles(roles);
        }

        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}